import { create } from 'zustand';
import { produce } from 'immer';

export interface ITask {
  name: string;
  minute: number;
}

type AppStore = {
  taskList: ITask[];
  addTask: (task: ITask) => void;
};

const useAppStore = create<AppStore>(set => ({
  taskList: [],
  addTask: (t) => set(
    produce(s => {
      s.taskList.push(t)
    })
  ),
}));

export default useAppStore;
