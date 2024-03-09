import EventEmitter from "eventemitter3";
class Environment extends EventEmitter {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW52aXJvbm1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWJzdHJhY3QvRW52aXJvbm1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxZQUFZLE1BQU0sZUFBZSxDQUFBO0FBb0J4QyxNQUFlLFdBQVksU0FBUSxZQUFxQztJQUloRSxNQUFNLEdBQVksS0FBSyxDQUFBO0lBSXZCLGlCQUFpQixHQUFXLEdBQUcsQ0FBQTtJQThIdEMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFVLElBQUcsQ0FBQztJQUVsQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQVUsSUFBRyxDQUFDO0lBU2pDLEVBQUUsQ0FBZ0QsS0FBUSxFQUFFLEVBQTZDO1FBQ3hHLE9BQU8sS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ2pDLENBQUM7SUFFRCxXQUFXLENBQ1YsS0FBUSxFQUNSLEVBQTZDO1FBRTdDLE9BQU8sS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQzFDLENBQUM7SUFFRCxJQUFJLENBQWdELEtBQVEsRUFBRSxFQUE2QztRQUMxRyxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUNuQyxDQUFDO0lBRUQsY0FBYyxDQUNiLEtBQVEsRUFDUixFQUE4QztRQUU5QyxPQUFPLEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUM3QyxDQUFDO0NBQ0Q7QUFFRCxlQUFlLFdBQVcsQ0FBQSJ9