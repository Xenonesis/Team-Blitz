export interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  skills: string;
}

export interface Hackathon {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  leader: Member;
  participants: Member[];
  location: string;
  website: string;
  prize: string;
  technologies: string;
  totalTasks: number;
  status: string;
  currentStage: string;
  progress: {
    completedTasks: number;
    totalTasks: number;
  };
  roundDates: { [key: string]: string };
}
