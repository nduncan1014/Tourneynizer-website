import React, { Component } from 'react';
import { Jumbotron, ButtonToolbar, ToggleButton, ToggleButtonGroup, ButtonGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { API_URL } from '../../resources/constants.jsx';
import ReactTable from 'react-table';

/*
* Page for viewing the user's currently active matches, tournaments, and teams
*/
class ProfileCurrentPage extends Component{
	constructor(){
		super();
		//loaded bools are set true when promise is fulfilled
		this.state={

			displayData: [],
			showing: 'teams',
			requests:[],
			requestTeam: '',
			tournamentsLoaded: true,
			teamsLoaded: false,
			matches: [],
			teams: [],
			tournaments: [],
		}
		this.handleRadioChange = this.handleRadioChange.bind(this);
		this.acceptTeam = this.acceptTeam.bind(this);
		this.rejectTeam = this.rejectTeam.bind(this);
		this.removeRequest = this.removeRequest.bind(this);
	}

	componentWillMount(){
		this.getTournaments();
		this.getTeams();
		this.getRequests();
	}

	handleRadioChange(e){
		console.log(e.target.value);
		if(parseInt(e.target.value) === 2){
			this.getTeams();
			this.setState({
				displayData: this.state.teams,
				showing: 'teams',
			})
		}else if(parseInt(e.target.value) === 3){
			this.setState({
				displayData: this.state.requests,
				showing: 'requests',
			})
		}else{
			this.setState({
				displayData: [],
			})
		}
	}

	//set user's current Teams
	getTeams(){
		let apiURL = API_URL + 'api/team/getAll';
		fetch(apiURL, {
			method: 'GET',
			credentials: 'include',
		})
		.then((response) => {
			if(response.ok){
				response.json().then(json => {
					this.setState({
						teams: json,
						teamsLoaded:true,
						displayData: json,
					});
				})
			}
		})
		.catch((error) => {
    		console.error(error);
    	});
	}

	getRequests(){	
		let apiURL = API_URL + 'api/user/requests/pending';
		fetch(apiURL, {
			method: 'GET',
			credentials: 'include',
		})
		.then((response) => {
			let reqs = [];
			if(response.ok){
				response.json().then(json => {
					reqs = json;
					const userPromises = json.map(request => {
						let apiURLUser = API_URL + 'api/user/' + request.requesterId;
						return (
							fetch(apiURLUser, {
								method: 'GET',
								credentials: 'include',
							})
						)
					})
					Promise.all(userPromises).then((responses) => {
						Promise.all(responses.map(res => res.json())).then(json => {
							let userReqs = [];
							//get requestIds and users together in object form
							for(let i = 0; i < reqs.length; i++){
								//if a match is found stop trying to find match and move on to next pair
								let found = false;
								console.log(reqs[i]);
								for(let j = 0; j < json.length && !found; j++){
									if(reqs[i].requesterId === json[j].id){
										let requestEntry = {
											requestId: reqs[i].id,
											userEmail: json[j].email,
											userName: json[j].name,
										} 
										userReqs.push(requestEntry);
										found = true;
									}
								}
							}
							console.log(userReqs);
							this.setState({
								requests: userReqs,
							})
						})
					})
				})
			}
		})
		.catch((error) => {
    		console.error(error);
    	});	
	}

	//set user's current tournaments
	getTournaments(){

	}

	rejectTeam(request){
		console.log(request);
		let apiURL = API_URL + 'api/requests/' + request;
		fetch(apiURL, {
			method: 'DELETE',
			credentials: 'include',
		})
		.then((response) => {
			if(!response.ok){
				response.json().then(json => {
					alert(json.message)
				})
			}else{
    			this.removeRequest(request);
			}
		})
		.catch((error) => {
    		console.error(error);
    	});

	}

	acceptTeam(request){
		console.log(request);
		let apiURL = API_URL +  'api/requests/' + request + '/accept';
		fetch(apiURL, {
			method: 'GET',
			credentials: 'include',
		})
		.then((response) => {
			if(!response.ok){
				response.json().then(json => {
					alert(json.message)
				})
			}else{
				this.removeRequest(request);
			}
		})
		.catch((error) => {
    		console.error(error);
    	});
	}

	removeRequest(id){
		console.log(id)
		this.setState(prevState => ({ 
	    	requests: prevState.requests.filter(request => request.requestId !== id), 
	    	displayData: prevState.requests.filter(request => request.requestId !== id),
	    }));
	}

	render(){
		if(this.state.tournamentsLoaded && this.state.teamsLoaded){
				let columns = [];
				if(this.state.showing === 'teams'){
					columns= [{
						Header: 'Name',
						accessor: 'name',
					},{
						Header: 'See Team Details',
						accessor: 'id',
						Cell: row => (
							<Link to={'/Profile/view/team/' + row.value}><Button>Team information</Button></Link>
						)
					}]
				}else if(this.state.showing === 'requests'){
					columns = [{
						Header: 'Name',
						accessor: 'userName',
					},{
						Header: 'Email',
						accessor: 'userEmail',
					},{
						Cell: original => (
							<div>
								<ButtonGroup>
									<Button onClick={() => this.acceptTeam(original.row._original.requestId)}>Accept</Button>
									<Button onClick={() => this.rejectTeam(original.row._original.requestId)}>Reject</Button>
								</ButtonGroup>
							</div>
						)
					}]
				}

			return(
				<div>
					<center>
						<Jumbotron>
							<h1>Current Tournaments/Requests/Teams</h1>
								<ButtonToolbar>
							  		<ToggleButtonGroup type="radio" name="options" defaultValue={2}>
							   			<ToggleButton onChange={this.handleRadioChange} value={1}>Tournaments</ToggleButton>
							      		<ToggleButton onChange={this.handleRadioChange} value={2}>Teams</ToggleButton>
							      		<ToggleButton onChange={this.handleRadioChange} value={3}>Requests</ToggleButton>
							    	</ToggleButtonGroup>
								</ButtonToolbar>
								<ReactTable
								    data={this.state.displayData}
			    					columns={columns}
			    					className="-highlight"
			    				/>
						</Jumbotron>
					</center>
				</div>
			);
		}else{
			return(
				<div>
					<Jumbotron><h3>Please log in to view this data...</h3></Jumbotron>
				</div>
			);
		}
	}
}

export default ProfileCurrentPage;