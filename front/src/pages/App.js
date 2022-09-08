import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route,Redirect,Switch, useLocation} from "react-router-dom";
import styled from 'styled-components';
import ScrollToTop from '../components/ScrollToTop';

import BottomMenu from '../components/BottomMenu'
import Header from '../components/Header';
import Footer from '../components/Footer';

import Home from './Home';
import Profile from './Profile';
import Ranking from './Ranking';
import Search from './Search';
import SelectCommunty from './SelectCommunity';

import Auction from './Auction/Auction';

import AddAuction from './Auth/AddAuction';
import Login from './Auth/Login';
import SignUp from './Auth/SignUp';
import FindId from './Auth/FindId';
import FindPw from './Auth/FindPw';
import Info from './Auth/Info';
import MyProfile from './Auth/MyProflie';
import ChangePw from './Auth/ChangePw';
import MyLog from './Auth/MyLog';
import SingOut from './Auth/SingOut';
import Favorite from './Auth/Favorite';

import Note from './Note/Note';
import AddNote from './Note/AddNote'
import MyNoteList from './Note/MyNoteList';
import ReadNote from './Note/ReadNote';

import AuctionList from './Auction/AuctionList';

import AddCommunity from './Community/AddCommunity';
import EditCommunity from './Community/EditCommunity';
import Community from './Community/Community';
import CommunityList from './Community/CommunityList';

import SearchResult from './Search/SearchResult';

import Messenger from './Messenger';
import MessengerLog from './MessengerLog';

import UserManage from './UserManage';
import PointShop from './PointShop';

const MarginTop1 = styled.div`
margin-top:5rem;
@media screen and (max-width:950px) {
    margin-top:3.5rem;
  }
`
const MarginBottom1 = styled.div`

@media screen and (max-width:950px) {
    margin-bottom:5rem;
  }
`
const App = () => {
 
  const [ userLog, setUserLog ] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if(ref.current && !ref.current.contains(event.target)) {
        setUserLog(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [ref])

    return (
        
            <Router >
              <ScrollToTop/>
                <Header/>
                <MarginTop1/>
                <>

                <Switch>
                
               
                <Route exact path="/" component={Home} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/ranking" component={Ranking} />
                <Route exact path="/search" component={Search} />
                <Route exact path="/selectcommunity" component={SelectCommunty} />

                <Route exact path="/auctionlist" component={AuctionList} />
                <Route exact path="/auction/:pk" component={Auction} />

                <Route exact path="/addauction" component={AddAuction} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/signup" component={SignUp} />
                <Route exact path="/findid" component={FindId} />
                <Route exact path="/findpw" component={FindPw} />
                <Route exact path="/myprofile/:pk" component={MyProfile} />
                <Route exact path="/changepw/:pk" component={ChangePw} />
                <Route exact path="/mylog/:pk" component={MyLog} />
                <Route exact path="/singout/:pk" component={SingOut} />
                <Route exact path='/info/:pk' component={Info}/>
                <Route exact path='/favorite' component={Favorite}/>

                <Route exact path='/note' component={Note}/>
                <Route exact path='/addnote' component={AddNote}/>
                <Route exact path='/mynotelist/:pk' component={MyNoteList}/>
                <Route exact path='/readnote/:pk' component={ReadNote}/>

                <Route exact path="/manager/auctionlist" component={AuctionList} />

                <Route exact path="/community/:pk" component={Community} />
                <Route exact path="/communitylist/:pk" component={CommunityList} />
                <Route exact path="/addcommunity/:pk" component={AddCommunity} />
                <Route exact path="/editcommunity/:pk" component={EditCommunity} />

                <Route exact path="/searchresult" component={SearchResult} />

                <Route exact path="/usermanage" component={UserManage} />
                <Route exact path="/pointshop" component={PointShop} />

                </Switch>
                
                <div ref={ref} style={{ position: "fixed", bottom: "24px", right: "24px" }}>
                  <MessengerLog 
                    userLog={userLog}
                  />
                  <Messenger 
                    onClick={() => setUserLog(true)}
                  />
                </div>
                
                <BottomMenu/>
            
                </>
                <Footer/>
                <MarginBottom1/>
            </Router>
       
    );
}


export default App