interface Habit {
  user: string;
  title: string;
  description: string;
  difficulty: number;
  alarmActive: boolean;
  alarm: string;
  coin: number;
  point: number;
  health: number;
  positive: boolean;
  completed: boolean;
}

export default Habit;
