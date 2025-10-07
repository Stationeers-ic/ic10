import { DeviceScope } from "@/Core/Device/DeviceScope";
import type { Network, NetworkType } from "@/Core/Network";
import type { ConnectionsType } from "@/Defines/devices";
import { BiMap } from "@/helpers";
export type PortType = Extract<ConnectionsType[keyof ConnectionsType], string>;

export class DevicePorts extends DeviceScope {
	private portIndices: BiMap<PortType, number>;
	private portNetworks: Map<PortType, Network> = new Map();

	constructor(props) {
		super(props);

		// Создаем карту соответствия типа порта его индексу
		this.portIndices = new BiMap();
		this.scope.rawData?.connections.forEach((connection: PortType, index: number) => {
			this.portIndices.set(connection, index);
		});
		if (this.portIndices.size === 0) {
			this.portIndices.set("Connection", 0);
		}
	}

	canConnect(networkType: NetworkType, portName: PortType): boolean {
		const portTypes = DevicePorts.getPortTypes(portName);
		return portTypes.includes(networkType);
	}

	static getPortTypes(portName: PortType): NetworkType[] {
		switch (portName) {
			case "Data Input":
			case "Data Output":
				return ["data"];
			case "Power Input":
			case "Power Output":
				return ["power"];
			case "Power and Data Input":
			case "Power and Data Output":
			case "Connection":
				return ["data", "power"];
			case "Chute Input":
			case "Chute Output":
			case "Chute Output 2":
				return ["chute"];
			case "Pipe Input":
			case "Pipe Input 2":
			case "Pipe Output":
			case "Pipe Output 2":
			case "Pipe Waste":
				return ["pipe"];
			case "Pipe Liquid Input":
			case "Pipe Liquid Input 2":
			case "Pipe Liquid Output":
			case "Pipe Liquid Output 2":
				return ["pipe"];
			case "Landing Pad Input":
				return ["landing"];
			default:
				return [];
		}
	}

	setPortChanel(port: PortType | number, Chanel: number, value: number): void {
		if (typeof port === "number") {
			port = this.portIndices.getByValue(port);
		}
		this.getNetwork(port).chanels.set(Chanel, value);
	}

	getPortChanel(port: PortType | number, Chanel: number): number {
		if (typeof port === "number") {
			port = this.portIndices.getByValue(port);
		}
		return this.getNetwork(port).chanels.get(Chanel);
	}

	setNetwork(port: number, network: Network): void {
		if (!this.portIndices.hasValue(port)) {
			throw new Error("Port not found");
		}
		if (!this.canConnect(network.type, this.portIndices.getByValue(port))) {
			throw new Error(`Cannot connect network ${network.type} to port ${this.portIndices.getByValue(port)}`);
		}
		this.portNetworks.set(this.portIndices.getByValue(port), network);
	}

	getNetwork(portOrindex: PortType | number | undefined = undefined): Network {
		let port: PortType;
		if (typeof portOrindex === "undefined") {
			port = this.portIndices.getByValue(this.getDefaultPortIndex());
		} else if (typeof portOrindex === "number") {
			if (!this.portIndices.hasValue(portOrindex)) {
				throw new Error(`Port index ${portOrindex} not found in device ${this.scope.hash}`);
			}
			port = this.portIndices.getByValue(portOrindex);
		} else {
			port = portOrindex;
		}
		if (this.portNetworks.has(port)) {
			return this.portNetworks.get(port);
		}
		throw new Error(`No network for port ${port} in device ${this.scope.hash}`);
	}

	/**
	 * Получить индекс порта по его типу
	 * @returns индекс порта или -1 если порт не найден
	 */
	getPortIndex(type: PortType): number {
		return this.portIndices.getByKey(type) ?? -1;
	}

	/**
	 * Проверить существует ли порт указанного типа
	 */
	hasPort(type: PortType): boolean {
		return this.portIndices.hasKey(type);
	}

	/**
	 * Получить все порты устройства в виде Map
	 */
	getAllPorts(): BiMap<PortType, number> {
		return this.portIndices;
	}

	/**
	 * Получить количество портов устройства
	 */
	getPortCount(): number {
		return this.portIndices.size;
	}

	getDefaultPortIndex(): number {
		return this.getDataPortIndex();
	}

	getDataPortIndex(): number {
		if (this.hasPort("Data Input")) {
			return this.getPortIndex("Data Input");
		}
		if (this.hasPort("Power and Data Input")) {
			return this.getPortIndex("Power and Data Input");
		}
		if (this.hasPort("Connection")) {
			return this.getPortIndex("Connection");
		}
		return -1;
	}

	getPowerPortIndex(): number {
		if (this.hasPort("Power Input")) {
			return this.getPortIndex("Power Input");
		}
		if (this.hasPort("Power and Data Input")) {
			return this.getPortIndex("Power and Data Input");
		}
		if (this.hasPort("Connection")) {
			return this.getPortIndex("Connection");
		}
		return -1;
	}
}
