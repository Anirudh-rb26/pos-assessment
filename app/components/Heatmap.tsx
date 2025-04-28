import { Box, Typography, Paper } from "@mui/material"
import type { Person } from "../types"

interface HeatmapProps {
    person: Person
    selectedSkill: string
}

const Heatmap = ({ person, selectedSkill }: HeatmapProps) => {
    console.log("Heatmap rendering for:", { person: person.name, selectedSkill });

    const getColor = (level: number) => {
        // Color palette: white/clear for 0, yellow for 1, and green shades for 2-4
        const colors = [
            "#ffffff", // 0 - white/clear
            "#fff59d", // 1 - yellow
            "#c5e1a5", // 2 - light green
            "#81c784", // 3 - medium green
            "#4caf50", // 4 - dark green
        ]
        return colors[level] || colors[0]
    }

    const getSkillLevel = (person: Person, skillName: string): number => {
        console.log(`Looking for skill ${skillName} in person data:`, person.name);

        if (!person.data?.data.skillset) {
            console.log("No skillset data found");
            return 0;
        }

        for (const skillset of person.data.data.skillset) {
            console.log(`Checking skillset: ${skillset.name}`);
            const skill = skillset.skills.find((s) => s.name === skillName);

            if (skill) {
                console.log(`Found skill ${skillName}`);
                if (skill.pos && skill.pos.length > 0) {
                    console.log(`Consensus score: ${skill.pos[0].consensus_score}`);
                    return skill.pos[0].consensus_score;
                } else {
                    console.log("No position data found for skill");
                }
            }
        }

        console.log(`Skill ${skillName} not found`);
        return 0;
    }

    const skillLevel = getSkillLevel(person, selectedSkill);
    console.log(`Final skill level for ${selectedSkill}: ${skillLevel}`);

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
                {person.name}'s {selectedSkill} Skill Level
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <Paper
                    elevation={1}
                    sx={{
                        width: "100%",
                        height: "100px",
                        backgroundColor: getColor(skillLevel),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background-color 0.3s ease",
                        border: "1px solid #e0e0e0",
                    }}
                >
                    <Typography variant="h4" color="text.primary">
                        Level {skillLevel}
                    </Typography>
                </Paper>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        px: 2,
                    }}
                >
                    {[0, 1, 2, 3, 4].map((level) => (
                        <Box
                            key={level}
                            sx={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: getColor(level),
                                borderRadius: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: level === skillLevel ? "2px solid #2e7d32" : "1px solid #e0e0e0",
                            }}
                        >
                            <Typography variant="body2">{level}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    )
}

export default Heatmap
