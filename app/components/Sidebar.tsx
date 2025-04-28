"use client"

import { List, ListItem, ListItemText, IconButton, Avatar, Typography, Box, Divider } from "@mui/material"
import type { Person } from "../types"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"

interface SidebarProps {
    people: Person[]
    onSelectPerson: (id: string) => void
    onComparePerson: (id: string) => void
    selectedForComparison: string[]
    getInitials: (name: string) => string
    view: "compare" | "individual" | "shortlist"
}

const Sidebar = ({ people, onSelectPerson, onComparePerson, selectedForComparison, getInitials, view }: SidebarProps) => {
    return (
        <Box 
            className="w-[230px] h-auto flex flex-col border-r border-black absolute left-0 top-[48px] bottom-[48px] my-auto"
        >
            <Box className="p-2 border-b border-black">
                <Typography variant="h6" className="font-bold text-base">
                    Most recommended
                </Typography>
            </Box>
            
            <Box 
                className="overflow-y-auto flex-grow max-h-[calc(48px*7)]"
                sx={{ 
                    '&::-webkit-scrollbar': {
                        width: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'rgba(0, 0, 0, 0.05)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(0, 0, 0, 0.3)',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: 'rgba(0, 0, 0, 0.5)',
                    },
                }}
            >
                <List disablePadding>
                    {people.map((person) => {
                        const isSelectedForComparison = selectedForComparison.includes(person.id)
                        return (
                            <ListItem
                                key={person.id}
                                className={`py-1.5 px-2 border-b border-black/[0.08] ${isSelectedForComparison ? "bg-[#4caf50] hover:bg-[#4caf50]" : "bg-transparent hover:bg-black/[0.05]"}`}
                            >
                                <Avatar
                                    className={`w-9 h-9 mr-2 text-sm ${isSelectedForComparison ? "bg-[#4caf50]" : "bg-[#616161]"} text-white`}
                                >
                                    {getInitials(person.name)}
                                </Avatar>
                                <ListItemText
                                    primary={
                                        <Typography className={`text-[0.9rem] font-normal ${isSelectedForComparison ? "text-white" : ""}`}>
                                            {person.name}
                                        </Typography>
                                    }
                                    onClick={() => onSelectPerson(person.id)}
                                    className="cursor-pointer"
                                />
                                <IconButton
                                    onClick={() => onComparePerson(person.id)}
                                    color={isSelectedForComparison ? "success" : "default"}
                                    size="small"
                                    className={isSelectedForComparison ? "text-white" : "text-black/70"}
                                >
                                    {isSelectedForComparison ? <RemoveIcon /> : <AddIcon />}
                                </IconButton>
                            </ListItem>
                        )
                    })}
                </List>
            </Box>
            
            {/* Removed the "Recommendations are based on..." text as requested */}
        </Box>
    )
}

export default Sidebar
