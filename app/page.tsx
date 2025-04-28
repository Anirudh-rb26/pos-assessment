"use client"

import { useEffect, useState } from "react"
import { Box, Container, Grid, Paper, Typography, Tabs, Tab, CircularProgress, IconButton, Chip } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { fetchPeople, fetchPersonDetails } from "./services/api"
import type { Person } from "./types"
import Sidebar from "./components/Sidebar"
import Heatmap from "./components/Heatmap"
import HeatmapGrid from "./components/HeatmapGrid"
import dynamic from "next/dynamic"

const ClientContainer = dynamic(() => Promise.resolve(Container), { ssr: false })

export default function Home() {
  console.log("Home component rendering")

  const [people, setPeople] = useState<Person[]>([])
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<string>("")
  const [skills, setSkills] = useState<string[]>([])
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([])
  const [comparisonPeople, setComparisonPeople] = useState<Person[]>([])
  const [view, setView] = useState<"compare" | "individual" | "shortlist">("compare")
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    console.log("Initial data loading effect triggered")

    const loadPeople = async () => {
      setLoading(true)
      try {
        console.log("Fetching people data...")
        const data = await fetchPeople()
        console.log(`Fetched ${data.length} people:`, data)

        setPeople(data)

        if (data.length > 0) {
          console.log("Extracting skills from people data")
          const allSkills = new Set<string>()

          data.forEach((person) => {
            console.log(`Processing skills for ${person.name}`)

            // Add detailed debugging for the first person
            if (person === data[0]) {
              console.log("First person data structure:", JSON.stringify(person, null, 2));
              console.log("First person skillset exists:", !!person.data?.data.skillset);
              if (person.data?.data.skillset) {
                console.log("First person skillset type:", typeof person.data.data.skillset);
                console.log("First person skillset is array:", Array.isArray(person.data.data.skillset));
                console.log("First person skillset:", JSON.stringify(person.data.data.skillset, null, 2));
              }
            }

            if (!person.data?.data.skillset) {
              console.log(`No skillset data for ${person.name}`);
              return;
            }

            person.data.data.skillset.forEach((skillset) => {
              console.log(`Processing skillset: ${skillset.name} with ${skillset.skills.length} skills`)

              skillset.skills.forEach((skill) => {
                console.log(`Adding skill: ${skill.name}`)
                allSkills.add(skill.name)
              })
            })
          })

          const skillsArray = Array.from(allSkills)
          console.log(`Extracted ${skillsArray.length} unique skills:`, skillsArray)

          setSkills(skillsArray)

          if (skillsArray.length > 0) {
            console.log(`Setting default selected skill to: ${skillsArray[0]}`)
            setSelectedSkill(skillsArray[0])
          }
        }
      } catch (error) {
        console.error("Error loading people:", error)
      } finally {
        console.log("Finished loading people data")
        setLoading(false)
      }
    }

    loadPeople()
  }, [])

  useEffect(() => {
    console.log("Selected for comparison changed:", selectedForComparison)

    const loadComparisonPeople = async () => {
      if (selectedForComparison.length === 0) {
        console.log("No people selected for comparison")
        setComparisonPeople([])
        return
      }

      setLoading(true)
      try {
        console.log(`Fetching details for ${selectedForComparison.length} people`)
        const peopleData = await Promise.all(selectedForComparison.map((id) => fetchPersonDetails(id)))
        const filteredPeople = peopleData.filter((person): person is Person => person !== null)
        console.log(`Fetched ${filteredPeople.length} people for comparison`)

        setComparisonPeople(filteredPeople)
      } catch (error) {
        console.error("Error loading comparison people:", error)
      } finally {
        setLoading(false)
      }
    }

    loadComparisonPeople()
  }, [selectedForComparison])

  const handlePersonSelect = async (id: string) => {
    console.log(`Selecting person with ID: ${id}`)

    setLoading(true)
    try {
      const person = await fetchPersonDetails(id)
      console.log("Fetched person details:", person)

      setSelectedPerson(person)
      setView("individual")
    } catch (error) {
      console.error("Error fetching person details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleComparePerson = (id: string) => {
    console.log(`Toggle comparison for person ID: ${id}`)

    setSelectedForComparison((prev) => {
      if (prev.includes(id)) {
        console.log(`Removing ${id} from comparison`)
        return prev.filter((personId) => personId !== id)
      } else {
        console.log(`Adding ${id} to comparison`)
        return [...prev, id]
      }
    })
  }

  const getInitials = (name: string) => {
    const initials = name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()

    console.log(`Initials for ${name}: ${initials}`)
    return initials
  }

  console.log("Current state:", {
    peopleCount: people.length,
    selectedPerson: selectedPerson?.name,
    selectedSkill,
    skillsCount: skills.length,
    selectedForComparison,
    comparisonPeopleCount: comparisonPeople.length,
    view,
    loading,
  })

  return (
    <ClientContainer maxWidth={false} disableGutters className="h-[100vh] flex flex-col overflow-hidden">
      {loading ? (
        <Box className="flex justify-center items-center h-full">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Header - fixed height of 50px */}
          <Box className="flex justify-between items-center h-[50px] p-0 border-b border-black">
            <Box className="flex items-center">
              <IconButton
                size="small"
                className="mr-1 text-[#757575] p-1"
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
              <Typography 
                variant="h6" 
                className="font-medium text-[#424242] text-sm"
              >
                Posk_UXdesigner_sr001
              </Typography>
            </Box>
            <Chip 
              label={`${people.length} Candidates`} 
              size="small" 
              className="bg-[#e8f5e9] text-[#2e7d32] font-medium text-xs h-[24px]" 
            />
          </Box>

          {/* Main Content Area with fixed heights */}
          <Box className="flex h-[calc(100vh-50px)]">
            {/* Sidebar - fixed width of 230px */}
            <Box className="w-[230px] h-full border-r border-black">
              <Sidebar
                people={people}
                onSelectPerson={handlePersonSelect}
                onComparePerson={handleComparePerson}
                selectedForComparison={selectedForComparison}
                getInitials={getInitials}
                view={view}
              />
            </Box>

            {/* Main Content */}
            <Box className="flex-1 h-full overflow-auto flex flex-col">
              {/* Tabs - fixed height */}
              <div className="p-0">
                <Tabs
                  value={view}
                  onChange={(_, newValue) => setView(newValue as "compare" | "individual" | "shortlist")}
                  className="min-h-[40px] [&_.MuiTabs-indicator]:hidden"
                >
                  <Tab
                    label="Compare view"
                    value="compare"
                    className={`normal-case font-medium text-sm min-w-[120px] min-h-[40px] py-2 px-4 border border-black mr-1 ${
                      view === "compare" 
                        ? "bg-[#4caf50] text-white" 
                        : "bg-transparent text-[#757575]"
                    }`}
                  />
                  <Tab
                    label="Individual view"
                    value="individual"
                    className={`normal-case font-medium text-sm min-w-[120px] min-h-[40px] py-2 px-4 border border-black mr-1 rounded-t-md ${
                      view === "individual"
                        ? "text-[#4caf50] border-b-0"
                        : "text-[#757575] border-b-black"
                    }`}
                  />
                  <Tab
                    label="Shortlisted candidates"
                    value="shortlist"
                    className={`normal-case font-medium text-sm min-w-[150px] min-h-[40px] py-2 px-4 border-b border-black rounded-t-md ${
                      view === "shortlist"
                        ? "text-[#4caf50] border-b-0"
                        : "text-[#757575] border-b-black"
                    }`}
                  />
                </Tabs>
              </div>

              {/* Content area */}
              <div className="flex-1 -mt-px">
                {/* Heatmap Content based on selected view */}
                {view === "compare" && (
                  <HeatmapGrid people={people} skills={skills} getInitials={getInitials} />
                )}

                {view === "shortlist" && (
                  <HeatmapGrid
                    people={people.filter((person) => selectedForComparison.includes(person.id))}
                    skills={skills}
                    getInitials={getInitials}
                  />
                )}

                {view === "individual" && selectedPerson && (
                  <Heatmap person={selectedPerson} selectedSkill={selectedSkill} />
                )}

                {view === "individual" && !selectedPerson && (
                  <div className="p-3 text-center border border-dashed border-[#e0e0e0] rounded-md bg-[#fafafa] m-4">
                    <Typography variant="body1" className="text-[#757575]">
                      Please select a candidate from the sidebar to view their individual skills.
                    </Typography>
                  </div>
                )}
              </div>
            </Box>
          </Box>
        </>
      )}
    </ClientContainer>
  )
}
