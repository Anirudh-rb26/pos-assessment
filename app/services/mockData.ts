import type { Person } from "../types";

// Mock data to use when the API is unavailable
export const mockPeople: Person[] = [
  {
    id: "mock1",
    name: "John Doe",
    data: {
      data: {
        skillset: [
          {
            id: "skillset1",
            name: "Technical Skills",
            skills: [
              {
                id: "skill1",
                name: "JavaScript",
                pos: [{ 
                  id: "pos1",
                  consensus_score: 4,
                  sVs: []
                }]
              },
              {
                id: "skill2",
                name: "React",
                pos: [{ 
                  id: "pos2",
                  consensus_score: 5,
                  sVs: []
                }]
              },
              {
                id: "skill3",
                name: "TypeScript",
                pos: [{ 
                  id: "pos3",
                  consensus_score: 3,
                  sVs: []
                }]
              }
            ]
          },
          {
            id: "skillset2",
            name: "Soft Skills",
            skills: [
              {
                id: "skill4",
                name: "Communication",
                pos: [{ 
                  id: "pos4",
                  consensus_score: 4,
                  sVs: []
                }]
              },
              {
                id: "skill5",
                name: "Teamwork",
                pos: [{ 
                  id: "pos5",
                  consensus_score: 5,
                  sVs: []
                }]
              }
            ]
          }
        ]
      }
    }
  },
  {
    id: "mock2",
    name: "Jane Smith",
    data: {
      data: {
        skillset: [
          {
            id: "skillset3",
            name: "Technical Skills",
            skills: [
              {
                id: "skill6",
                name: "JavaScript",
                pos: [{ 
                  id: "pos6",
                  consensus_score: 5,
                  sVs: []
                }]
              },
              {
                id: "skill7",
                name: "React",
                pos: [{ 
                  id: "pos7",
                  consensus_score: 4,
                  sVs: []
                }]
              },
              {
                id: "skill8",
                name: "TypeScript",
                pos: [{ 
                  id: "pos8",
                  consensus_score: 5,
                  sVs: []
                }]
              }
            ]
          },
          {
            id: "skillset4",
            name: "Soft Skills",
            skills: [
              {
                id: "skill9",
                name: "Communication",
                pos: [{ 
                  id: "pos9",
                  consensus_score: 5,
                  sVs: []
                }]
              },
              {
                id: "skill10",
                name: "Teamwork",
                pos: [{ 
                  id: "pos10",
                  consensus_score: 4,
                  sVs: []
                }]
              }
            ]
          }
        ]
      }
    }
  },
  {
    id: "mock3",
    name: "Alex Johnson",
    data: {
      data: {
        skillset: [
          {
            id: "skillset5",
            name: "Technical Skills",
            skills: [
              {
                id: "skill11",
                name: "JavaScript",
                pos: [{ 
                  id: "pos11",
                  consensus_score: 3,
                  sVs: []
                }]
              },
              {
                id: "skill12",
                name: "React",
                pos: [{ 
                  id: "pos12",
                  consensus_score: 3,
                  sVs: []
                }]
              },
              {
                id: "skill13",
                name: "TypeScript",
                pos: [{ 
                  id: "pos13",
                  consensus_score: 4,
                  sVs: []
                }]
              }
            ]
          },
          {
            id: "skillset6",
            name: "Soft Skills",
            skills: [
              {
                id: "skill14",
                name: "Communication",
                pos: [{ 
                  id: "pos14",
                  consensus_score: 3,
                  sVs: []
                }]
              },
              {
                id: "skill15",
                name: "Teamwork",
                pos: [{ 
                  id: "pos15",
                  consensus_score: 5,
                  sVs: []
                }]
              }
            ]
          }
        ]
      }
    }
  }
];
