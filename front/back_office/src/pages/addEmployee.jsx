import {TextEditor} from "../components/textEditor"
import { useState } from "react"

export const AddEmployee = () => {
    const [text, setText] = useState("");

    return (
        <div>
            Employee :
            <TextEditor defaultValue={""} OnChange={setText}/>
            <div dangerouslySetInnerHTML={{__html:text}}/>
        </div>
    )
}