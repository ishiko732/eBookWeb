import { IconButton, List, ListItem, ListItemText } from "@mui/material"
import { note } from "../../api/models";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useReadContext } from "./ReadContext";
import { useEffect, useState } from "react";
import { deleteNote } from "../../api/note";

export const Notes=()=>{
    const [items,setItems]=useState<note[]>([]);
    const {notes,vd}=useReadContext();

    useEffect(()=>{
        setItems(notes)
    },[notes])
    return (
        <div id="notes">
            <List dense={true}>
              {items.map(note=>{
                const commnet=note.data!==""?JSON.parse(note.data):null
                return (
                <ListItem key={note.id}
                secondaryAction={
                    <IconButton
                      edge="start"
                      onClick={(event) => {
                        if(commnet&&commnet.id){
                            console.log(vd)
                            vd&&vd.removeCommentIds([commnet.id])
                        }else{
                            deleteNote(note.id)
                        }
                    }}
                      color="primary"
                    >
                      <DeleteIcon />
                    </IconButton>
                }
                >
                <ListItemText
                  primary={commnet?commnet["text"]||note.sfld:note.sfld}
                //   secondary={note.sfld}
                />
              </ListItem>
              )
              })}
            </List>
        </div>
    )
}


const Note=()=>{
    return 
}
