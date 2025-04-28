import axios from "axios";
import type { Person } from "../types";
import { mockPeople } from "./mockData";

const BASE_URL = "https://forinterview.onrender.com";
const USE_MOCK_DATA = true; // Set to true to use mock data instead of the real API

export const fetchPeople = async (): Promise<Person[]> => {
  console.log(`Fetching people from ${BASE_URL}/people`);
  
  // Use mock data if enabled or as fallback
  if (USE_MOCK_DATA) {
    console.log("Using mock data instead of API");
    return mockPeople;
  }

  try {
    const response = await axios.get(`${BASE_URL}/people`);
    console.log(`Fetched ${response.data.length} people successfully`);

    // Log the first person to see the structure
    if (response.data.length > 0) {
      console.log(
        "First person data structure:",
        JSON.stringify(response.data[0], null, 2).substring(0, 500) + "..."
      );
    }

    // Load the first 3 people with detailed data (including skillset) to ensure
    // we have some skills to display in the heatmap
    if (response.data.length > 0) {
      console.log("Loading detailed data for ALL people to get skillsets...");

      try {
        // Load all people instead of just the first 3
        const peopleToLoad = response.data;

        // Fetch detailed data for each person in parallel
        const detailedPeoplePromises = peopleToLoad.map((person: Person) =>
          fetchPersonDetails(person.id)
        );

        const detailedPeople = await Promise.all(detailedPeoplePromises);

        // Replace the basic people data with detailed data for those that loaded successfully
        detailedPeople.forEach((detailedPerson) => {
          if (detailedPerson) {
            const index = response.data.findIndex((p: Person) => p.id === detailedPerson.id);
            if (index >= 0) {
              response.data[index] = detailedPerson;
              console.log(`Loaded detailed data for ${detailedPerson.name}`);
            }
          }
        });
      } catch (error) {
        console.error("Error loading detailed people data:", error);
        // Continue with the basic data if detailed loading fails
      }
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching people:", error);
    console.log("Falling back to mock data due to API error");
    return mockPeople; // Fallback to mock data on error
  }
};

export const fetchPersonDetails = async (id: string): Promise<Person | null> => {
  console.log(`Fetching details for person ID: ${id}`);
  
  // Use mock data if enabled or as fallback
  if (USE_MOCK_DATA) {
    console.log("Using mock data instead of API for person details");
    const mockPerson = mockPeople.find(person => person.id === id);
    return mockPerson || null;
  }

  try {
    const response = await axios.get(`${BASE_URL}/people/${id}`);
    console.log(`Successfully fetched details for ${response.data.name}`);

    // Log the structure of the person data
    console.log(
      "Person data structure:",
      JSON.stringify(response.data, null, 2).substring(0, 500) + "..."
    );

    return response.data;
  } catch (error) {
    console.error(`Error fetching person details for ID ${id}:`, error);
    
    // Try to find the person in mock data as fallback
    const mockPerson = mockPeople.find(person => person.id === id);
    if (mockPerson) {
      console.log(`Falling back to mock data for person ID ${id}`);
      return mockPerson;
    }
    
    return null;
  }
};

export const extractConsensusScores = (person: Person): { [key: string]: number } => {
  console.log(`Extracting consensus scores for ${person.name}`);

  const scores: { [key: string]: number } = {};

  if (!person.data?.data.skillset) {
    console.log("No skillset data found");
    return scores;
  }

  person.data.data.skillset.forEach((skillset) => {
    console.log(`Processing skillset: ${skillset.name}`);

    skillset.skills.forEach((skill) => {
      if (skill.pos && skill.pos.length > 0) {
        // Take the first position's consensus score
        scores[skill.name] = skill.pos[0].consensus_score;
        console.log(`Score for ${skill.name}: ${skill.pos[0].consensus_score}`);
      } else {
        console.log(`No position data for skill ${skill.name}`);
      }
    });
  });

  console.log(`Extracted ${Object.keys(scores).length} scores`);
  return scores;
};
