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
import ChangeCategory from './Auth/ChangeCategory';
import ChangePassword from './Auth/ChangePassword';
import Login from './Auth/Login';
import MyAuctionList from './Auth/MyAuctionList';
import SignUp from './Auth/SignUp';
import Info from './Auth/Info';
import Favorite from './Auth/Favorite';

import AuctionList from './Manager/AuctionList';
import UserInfo from './Manager/UserInfo';
import UserList from './Manager/UserList';

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

                <Route exact path="/auction/:pk" component={Auction} />

                <Route exact path="/addauction" component={AddAuction} />
                <Route exact path="/changecategory" component={ChangeCategory} />
                <Route exact path="/changepassword" component={ChangePassword} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/myauctionlist" component={MyAuctionList} />
                <Route exact path="/signup" component={SignUp} />
                <Route exact path='/info/:pk' component={Info}/>
                <Route exact path='/favorite' component={Favorite}/>

                <Route exact path="/manager/auctionlist" component={AuctionList} />
                <Route exact path="/manager/userinfo" component={UserInfo} />
                <Route exact path="/manager/userlist" component={UserList} />

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