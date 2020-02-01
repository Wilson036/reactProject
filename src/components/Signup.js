import React from 'react';
import { Button, Box, Heading,Text , Container, TextField} from "gestalt";
import ToastMessage from "./ToastMessage";
import {setToken} from '../utils'
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';


const apiUrl = process.env.API_URL||'http://localhost:1337';

class Signup extends React.Component {

    state ={
      username:'',
      password:'',
      email:'',
      toast: false,
      toastMessage: '',
      loading: false
    }
    handleChange = ({event, value}) => {
        event.persist();
        this.setState({[event.target.name]: value});
    }
    handSubmit = async event => {
        event.preventDefault();
        const {username ,password ,email} = this.state;
        if(this.isFormEmpty(this.state)){
          this.showToast('fill all forms');  
          return;
        }  
        try {
          this.setState({ loading: true});
          const {data} = await axios.post('http://localhost:1337/auth/local/register', {
            username: username,
            email: email,
            password: password,
            });
  
          this.setState({ loading: false});

          setToken(data.jwt)
          this.redirectUser('/');
        } catch (error) {
            this.setState({ loading: false});
            this.showToast(error.message);
            console.log('err',error.message);
        }
    }

    isFormEmpty = ({username, email , password}) => {
        return !username||!email||!password;
    }

    showToast = toastMessage =>{
        this.setState({toast: true,toastMessage});
        setTimeout(()=> this.setState({toast: false,toastMessage: ''}),5000);

    }

    redirectUser = url =>this.props.history.push(url);
    render(){
        const { toastMessage, toast ,loading} =this.state;
        const responseGoogle = (response) => {
            console.log(response);
          }
        const responseFacebook = (response) => {
            console.log(response);
        }  
        return(
            <Container>
                <Box 
                   dangerouslySetInlineStyle={{
                       __style: {
                           backgroundColor: '#ebe2da'
                       }
                   }}
                   margin ={4}
                   padding ={4}
                   shape="rounded"
                   display="flex"
                   justifyContent="center" >
                   <form style ={{
                       display:'inlineBlock',
                       textAlign: 'center',
                       maxWidth: 450
                   }}
                   onSubmit ={this.handSubmit}>
                    <Box
                       marginBottom ={2}
                       display="flex"
                       direction="column"
                       alignItems="center" >
                       <Heading color="midnight">Let's Get Started</Heading>
                       <Text italic color="orchid">Sign up to order some brew</Text>
                    </Box>
                    <TextField
                      id="username"
                      type="text"
                      name="username"
                      placeholder="Username"
                      onChange={this.handleChange} 
                    />
                    <TextField
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      onChange={this.handleChange} 
                    />
                    <TextField
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Password"
                      onChange={this.handleChange} 
                    />
                    <Button 
                     inline
                     disabled={loading}
                     color="blue"
                     text="Submit"
                     type="Submit"/>
                   </form>
                   
                </Box>
                <Box
                       marginBottom ={2}
                       display="flex"
                       direction="column"
                       alignItems="center" >
                       <GoogleLogin
                       inline
                       clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                       buttonText="Login By Google"
                       onSuccess={responseGoogle}
                       onFailure={responseGoogle}
                       cookiePolicy={'single_host_origin'}
                       />
                       <FacebookLogin
                        appId="476668206572678"
                        autoLoad={true}
                        fields="name,email,picture"
                        callback={responseFacebook}
                        cssClass="my-facebook-button-class"
                        icon="fa-facebook"
                        />  
                </Box>
                <ToastMessage  show={toast} message={toastMessage}/>
            </Container>
        )
    }
}

export default Signup;