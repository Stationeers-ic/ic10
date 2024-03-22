import EventEmitter from "eventemitter3";
export class Environment extends EventEmitter {
    isTest = false;
    InfiniteLoopLimit = 500;
    async beforeLineRun(line) { }
    async afterLineRun(line) { }
    on(event, fn) {
        return super.on(event, fn, this);
    }
    addListener(event, fn) {
        return super.addListener(event, fn, this);
    }
    once(event, fn) {
        return super.once(event, fn, this);
    }
    removeListener(event, fn) {
        return super.removeListener(event, fn, this);
    }
}
export default Environment;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW52aXJvbm1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWJzdHJhY3QvRW52aXJvbm1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUEsT0FBTyxZQUFZLE1BQU0sZUFBZSxDQUFBO0FBbUJ4QyxNQUFNLE9BQWdCLFdBQXFELFNBQVEsWUFHbEY7SUFJTyxNQUFNLEdBQVksS0FBSyxDQUFBO0lBQ3ZCLGlCQUFpQixHQUFXLEdBQUcsQ0FBQTtJQThIdEMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFVLElBQUcsQ0FBQztJQUVsQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQVcsSUFBRyxDQUFDO0lBU2xDLEVBQUUsQ0FDRCxLQUFRLEVBQ1IsRUFBaUQ7UUFFakQsT0FBTyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDakMsQ0FBQztJQUVELFdBQVcsQ0FDVixLQUFRLEVBQ1IsRUFBaUQ7UUFFakQsT0FBTyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDMUMsQ0FBQztJQUVELElBQUksQ0FDSCxLQUFRLEVBQ1IsRUFBaUQ7UUFFakQsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDbkMsQ0FBQztJQUVELGNBQWMsQ0FDYixLQUFRLEVBQ1IsRUFBa0Q7UUFFbEQsT0FBTyxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDN0MsQ0FBQztDQUNEO0FBRUQsZUFBZSxXQUFXLENBQUEifQ==