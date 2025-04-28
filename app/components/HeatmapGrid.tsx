import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tooltip,
    Avatar,
    Typography,
} from "@mui/material"
import type { Person } from "../types"
import React from "react"

interface HeatmapGridProps {
    people: Person[]
    skills: string[]
    getInitials: (name: string) => string
}

const getSkillLevel = (person: Person, skillName: string): number => {
    console.log(`Checking skill level for ${skillName} in person:`, person.name);

    if (!person.data?.data.skillset) {
        console.log(`No skillset found for ${person.name}`);
        return 0;
    }

    // Verify skillset is an array
    if (!Array.isArray(person.data.data.skillset)) {
        console.log(`WARNING: skillset for ${person.name} is not an array:`, typeof person.data.data.skillset);
        return 0;
    }

    for (const skillset of person.data.data.skillset) {
        console.log(`Checking skillset: ${skillset.name}`);

        // Verify skills is an array
        if (!Array.isArray(skillset.skills)) {
            console.log(`WARNING: skills in skillset ${skillset.name} is not an array:`, typeof skillset.skills);
            continue;
        }

        const skill = skillset.skills.find((s) => s.name === skillName);

        if (skill) {
            console.log(`Found skill ${skillName} in skillset ${skillset.name}`);

            if (skill.pos && skill.pos.length > 0) {
                console.log(`Consensus score for ${skillName}: ${skill.pos[0].consensus_score}`);
                return skill.pos[0].consensus_score;
            } else {
                console.log(`No position data for skill ${skillName}`);
            }
        }
    }

    console.log(`No matching skill found for ${skillName}`);
    return 0;
}

const getColor = (level: number) => {
    // Color palette based on the light theme design
    const colors = [
        "#ffffff", // 0 - white/clear
        "#fff9c4", // 1 - light yellow
        "#dcedc8", // 2 - light green
        "#a5d6a7", // 3 - medium green
        "#4caf50", // 4 - dark green
    ]
    // Clamp level to 0-4
    const idx = Math.max(0, Math.min(4, Math.round(level)))
    return colors[idx] || colors[0]
}

const HeatmapGrid = ({ people, skills, getInitials }: HeatmapGridProps) => {
    console.log("HeatmapGrid rendering with:", {
        peopleCount: people.length,
        skillsCount: skills.length
    });

    // Add detailed debugging
    console.log("Skills array:", skills);
    if (skills.length === 0) {
        console.log("WARNING: Skills array is empty!");
    }

    if (people.length > 0 && people[0].data?.data.skillset) {
        console.log("Example skillset from first person:",
            JSON.stringify(people[0].data.data.skillset, null, 2).substring(0, 500));
    }

    // Count how many people have skillset data loaded
    const peopleWithSkillsets = people.filter(person => person.data?.data.skillset).length;
    console.log(`${peopleWithSkillsets} out of ${people.length} people have skillset data loaded`);

    if (people.length === 0) {
        console.log("No people to display in heatmap");
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body1">No candidates selected for comparison.</Typography>
            </Box>
        )
    }

    // Group skills by skillset group
    const skillGroups: Record<string, string[]> = {}

    // If skills array is empty, extract skills from people data
    const extractedSkills = new Set<string>();
    if (skills.length === 0 && people.length > 0) {
        console.log("Extracting skills directly from people data since skills prop is empty");

        people.forEach(person => {
            if (person.data?.data.skillset) {
                person.data.data.skillset.forEach(skillset => {
                    skillset.skills.forEach(skill => {
                        extractedSkills.add(skill.name);
                    });
                });
            }
        });

        console.log(`Extracted ${extractedSkills.size} skills directly from people data`);
    }

    const skillsToUse = skills.length > 0 ? skills : Array.from(extractedSkills);

    // Group skills by category
    people.forEach(person => {
        if (person.data?.data.skillset) {
            person.data.data.skillset.forEach(skillset => {
                const groupName = skillset.name;
                if (!skillGroups[groupName]) {
                    skillGroups[groupName] = [];
                }

                skillset.skills.forEach(skill => {
                    if (skillsToUse.includes(skill.name) && !skillGroups[groupName].includes(skill.name)) {
                        skillGroups[groupName].push(skill.name);
                    }
                });
            });
        }
    });

    console.log("Skill groups:", skillGroups);

    return (
        <Box sx={{ width: "100%", overflowX: "auto" }}>
            <TableContainer 
                component={Paper} 
                elevation={0}
                sx={{ 
                    maxHeight: "calc(100vh - 200px)",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                }}
            >
                <Table stickyHeader size="small" sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    width: "200px",
                                    backgroundColor: "#f5f5f5",
                                    position: "sticky",
                                    left: 0,
                                    top: 0,
                                    zIndex: 3,
                                    borderBottom: "1px solid #e0e0e0",
                                    padding: "12px 16px",
                                    fontWeight: 600,
                                    fontSize: "0.875rem",
                                    color: "#424242",
                                }}
                            >
                                Skills
                            </TableCell>
                            {people.map((person) => (
                                <TableCell
                                    key={person.id}
                                    align="center"
                                    sx={{
                                        padding: "4px 2px",
                                        minWidth: "30px",
                                        borderBottom: "2px solid #e0e0e0",
                                    }}
                                >
                                    <Tooltip title={person.name} arrow>
                                        <Avatar
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                fontSize: "0.7rem",
                                                bgcolor: "#4caf50",
                                                margin: "0 auto",
                                            }}
                                        >
                                            {getInitials(person.name)}
                                        </Avatar>
                                    </Tooltip>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(skillGroups).map(([groupName, groupSkills]) => {
                            console.log(`Rendering skill group: ${groupName} with ${groupSkills.length} skills`);
                            return (
                                <React.Fragment key={groupName}>
                                    <TableRow>
                                        <TableCell
                                            colSpan={people.length + 1}
                                            sx={{
                                                fontWeight: 500,
                                                position: "sticky",
                                                left: 0,
                                                zIndex: 2,
                                                backgroundColor: "#f5f5f5",
                                                padding: "4px 12px",
                                                fontSize: "0.75rem",
                                                color: "#424242",
                                                borderBottom: "1px solid #e0e0e0",
                                            }}
                                        >
                                            {groupName}
                                        </TableCell>
                                    </TableRow>
                                    {groupSkills.map((skill) => {
                                        console.log(`Rendering skill row: ${skill}`);
                                        return (
                                            <TableRow key={skill} hover>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    sx={{
                                                        fontWeight: 400,
                                                        position: "sticky",
                                                        left: 0,
                                                        zIndex: 1,
                                                        backgroundColor: "white",
                                                        padding: "4px 12px",
                                                        fontSize: "0.75rem",
                                                        color: "#616161",
                                                        borderBottom: "1px solid #f0f0f0",
                                                    }}
                                                >
                                                    {skill}
                                                </TableCell>
                                                {people.map((person) => {
                                                    const level = getSkillLevel(person, skill);
                                                    console.log(`Skill level for ${person.name}, ${skill}: ${level}`);
                                                    return (
                                                        <TableCell
                                                            key={person.id + skill}
                                                            align="center"
                                                            sx={{
                                                                backgroundColor: getColor(level),
                                                                border: "1px solid #f0f0f0",
                                                                width: "30px",
                                                                height: "24px",
                                                                padding: 0,
                                                                transition: "all 0.2s ease-in-out",
                                                                "&:hover": {
                                                                    opacity: 0.8,
                                                                },
                                                            }}
                                                        >
                                                            {/* Removed the level number as requested */}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default HeatmapGrid
