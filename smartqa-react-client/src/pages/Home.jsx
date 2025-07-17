import {Link} from "react-router-dom";
function Home(){
    return(
        <div className="container text-center py-5">
            <h2 className="mb-2">SmartQA💡 - Get Started!</h2>
            <p className="mb-1">
                Click on create Room if you are the host to get started.
                Share the code with participants.
            </p>
            <p className="mb-4">
                if you are a Participants,then click on the join Room.
                Ask for the room code from the host of the meetings.
            </p>
            <Link to="/create" className='btn btn-primary me-1'>
            Create Room
            </Link>
            <Link to="/join" className='btn btn-success'>
            Join Room
            
            </Link>
        </div>
    );
}
export default Home;