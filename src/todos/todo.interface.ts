interface Todo {
  user: string;
  title: string;
  description: string;
  difficulty: number;
  dateStart: Date;
  dateEnd: Date;
  alarmActive: boolean;
  alarm: string;
  coin: number;
  point: number;
  health: number;
  completed: boolean;
}

export default Todo;
