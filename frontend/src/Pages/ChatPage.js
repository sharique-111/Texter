import { ChatState } from "../Context/ChatProvider"
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Components/Miscellaneous/SideDrawer";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";
import { useState } from "react";
const Chatpage = () => {
    const {user} = ChatState();
    const [fetchAgain,setFetchAgain] = useState(false);
    return (
        <div style={{width:"100%"}}>
            { user && <SideDrawer/> }
            <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
                { user && <MyChats fetchAgain={fetchAgain}/> }
                { user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/> }
            </Box>
        </div>
    )
}
export default Chatpage;