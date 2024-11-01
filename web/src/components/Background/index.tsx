import { ReactNode } from "react"
import "./style.css";

type Props = {
    children: ReactNode
}

export default function Background({ children }:Props){
    return (
        <div className="background dark-bg">
            {children}
        </div>
    )
}