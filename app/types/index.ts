export interface Person {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  data?: PersonData;
}

export interface PersonData {
  data: {
    id: string;
    company_id: string;
    job_title: string;
    recruiter_entity_id: string;
    experience_level: string;
    status: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    companyId: string;
    skillset: Skillset[];
  };
}

export interface Skillset {
  id: string;
  name: string;
  skills: Skill[];
  skillset_group?: {
    id: string;
    grouping_name: string;
  };
}

export interface Skill {
  id: string;
  name: string;
  pos: Position[];
}

export interface Position {
  id: string;
  consensus_score: number;
  sVs: any[]; // We don't need the detailed sVs data for the heatmap
}
