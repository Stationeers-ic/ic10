import { DeviceScope, type DeviceScopeConstructor } from "@/Core/Device/DeviceScope";
import type { Network, NetworkType } from "@/Core/Network";
import type { ConnectionsType } from "@/Defines/devices";
import i18n from "@/Languages/lang";

export type PortType = Extract<ConnectionsType[keyof ConnectionsType], string>;
export type PortEntry = {
	port: PortType;
	index: number;
	network: Network;
	isDefault: boolean;
};
export type PortIterator = IterableIterator<PortEntry>;

export class DevicePorts extends DeviceScope {
	private portIndices: Map<PortType, number> = new Map();
	private portIndexToTypes: Map<number, PortType[]> = new Map();
	private portNetworks: Map<PortType, Network> = new Map();

	private static expandCompositePort(port: PortType): PortType[] {
		switch (port) {
			case "Power and Data Input":
				return ["Data Input", "Power Input"];
			case "Power and Data Output":
				return ["Data Output", "Power Output"];
			case "Connection":
				return ["Data Input", "Power Input"];
			default:
				return [port];
		}
	}

	constructor(props: DeviceScopeConstructor) {
		super(props);

		this.scope.rawData?.connections.forEach((connection: PortType, index: number) => {
			const expandedPorts = DevicePorts.expandCompositePort(connection);
			for (const port of expandedPorts) {
				this.portIndices.set(port, index);
				if (!this.portIndexToTypes.has(index)) {
					this.portIndexToTypes.set(index, []);
				}
				this.portIndexToTypes.get(index)!.push(port);
			}
		});
	}

	public canConnect(networkType: NetworkType, portName: PortType): boolean {
		return DevicePorts.getPortTypes(portName) === networkType;
	}

	public static getPortTypes(portName: PortType): NetworkType {
		switch (portName) {
			case "Data Input":
			case "Data Output":
				return "data";
			case "Power Input":
			case "Power Output":
				return "power";
			case "Chute Input":
			case "Chute Output":
			case "Chute Output 2":
				return "chute";
			case "Pipe Input":
			case "Pipe Input 2":
			case "Pipe Output":
			case "Pipe Output 2":
			case "Pipe Waste":
				return "pipe";
			case "Pipe Liquid Input":
			case "Pipe Liquid Input 2":
			case "Pipe Liquid Output":
			case "Pipe Liquid Output 2":
				return "liquid";
			case "Landing Pad Input":
				return "landing";
			default:
				return "data";
		}
	}

	public setPortChanel(port: PortType | number, Chanel: number, value: number): void {
		if (typeof port === "number") {
			const portTypes = this.portIndexToTypes.get(port);
			if (portTypes && portTypes.length > 0) {
				port = portTypes[0];
			}
		}
		this.getNetwork(port).chanels.set(Chanel, value);
	}

	public getPortChanel(port: PortType | number, Chanel: number): number {
		if (typeof port === "number") {
			const portTypes = this.portIndexToTypes.get(port);
			if (portTypes && portTypes.length > 0) {
				port = portTypes[0];
			}
		}
		return this.getNetwork(port).chanels.get(Chanel)!;
	}

	public setNetwork(port: number, network: Network): void {
		if (!this.portIndexToTypes.has(port)) {
			throw new Error(i18n.t("error.port_not_found"));
		}
		const portTypes = this.portIndexToTypes.get(port)!;
		const compatiblePort = portTypes.find((pt) => DevicePorts.getPortTypes(pt) === network.type);
		if (!compatiblePort) {
			throw new Error(
				i18n.t("error.cannot_connect_network_to_port", {
					networkType: network.type,
					portName: portTypes.join(", "),
				}),
			);
		}
		this.portNetworks.set(compatiblePort, network);
	}

	public getNetwork(portOrindex: PortType | number | undefined = undefined): Network {
		let port: PortType;
		if (typeof portOrindex === "undefined") {
			const defaultIndex = this.getDefaultPortIndex();
			const portTypes = this.portIndexToTypes.get(defaultIndex);
			if (portTypes && portTypes.length > 0) {
				port = portTypes[0];
			} else {
				port = "Data Input";
			}
		} else if (typeof portOrindex === "number") {
			if (!this.portIndexToTypes.has(portOrindex)) {
				throw new Error(
					i18n.t("error.port_index_not_found", {
						index: portOrindex,
						hash: this.scope.hash,
					}),
				);
			}
			const portTypes = this.portIndexToTypes.get(portOrindex)!;
			for (const pt of portTypes) {
				if (this.portNetworks.has(pt)) {
					return this.portNetworks.get(pt)!;
				}
			}
			throw new Error(
				i18n.t("error.no_network_for_port", {
					port: portOrindex,
					hash: this.scope.hash,
				}),
			);
		} else {
			port = portOrindex;
		}
		if (this.portNetworks.has(port)) {
			return this.portNetworks.get(port)!;
		}
		throw new Error(
			i18n.t("error.no_network_for_port", {
				port,
				hash: this.scope.hash,
			}),
		);
	}

	/**
	 * Получить индекс порта по его типу
	 * @returns индекс порта или -1 если порт не найден
	 */
	public getPortIndex(type: PortType): number {
		return this.portIndices.get(type) ?? -1;
	}

	/**
	 * Проверить существует ли порт указанного типа
	 */
	public hasPort(type: PortType): boolean {
		return this.portIndices.has(type);
	}

	/**
	 * Получить все порты устройства в виде Map
	 */
	public getAllPorts(): Map<PortType, number> {
		return this.portIndices;
	}

	/**
	 * Получить количество портов устройства
	 */
	public getPortCount(): number {
		return this.portIndices.size;
	}

	public getDefaultPortIndex(): number {
		return this.getDataPortIndex();
	}

	public getDataPortIndex(): number {
		if (this.hasPort("Data Input")) {
			return this.getPortIndex("Data Input");
		}
		return -1;
	}

	public getPowerPortIndex(): number {
		if (this.hasPort("Power Input")) {
			return this.getPortIndex("Power Input");
		}
		return -1;
	}

	[Symbol.iterator](): PortIterator {
		const entries = Array.from(this.portIndices.entries());
		let i = 0;
		const self = this;
		return {
			[Symbol.iterator]() {
				return this;
			},
			next(): IteratorResult<PortEntry> {
				while (i < entries.length) {
					const [port, index] = entries[i++];
					if (self.portNetworks.has(port)) {
						return {
							done: false,
							value: {
								port,
								index,
								network: self.portNetworks.get(port)!,
								isDefault: self.getDefaultPortIndex() === index,
							},
						};
					}
				}
				return { done: true, value: undefined as any };
			},
		};
	}
}
