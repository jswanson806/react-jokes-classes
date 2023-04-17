import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css"

class Jokelist extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            numJokesToGet: 10,
            jokes: [],
            sortedJokes: [],
        }
        this.generateNewJokes = this.generateNewJokes.bind(this);
    }
    
    getJokes = () => {
        const retrieveJokes = async () => {
            let j = [...this.state.jokes];
            let seenJokes = new Set();
            try {
                while (j.length < this.state.numJokesToGet) {
                    let res = await axios.get("https://icanhazdadjoke.com", {
                        headers: { Accept: "application/json" }
                    });
                    let { status, ...jokeObj } = res.data;

                    if(!seenJokes.has(jokeObj.id)){
                        seenJokes.add(jokeObj.id);
                        j.push({...jokeObj, votes: 0});
                    } else {
                        console.error("duplicate found!");
                    }
                }
                this.setState({jokes: j});
            } catch (e) {
                console.log(e);
            }
        }
        retrieveJokes();
    }

    generateNewJokes = () => {
        this.setState({jokes: []}, () => {
            this.getJokes();
        });
        
    }

    vote = (id, delta) => {
        this.setState({jokes: this.state.jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))})
    }

    sortJokes = () => {
        this.setState({ sortedJokes: [...this.state.jokes].sort((a, b) => b.votes - a.votes)});
    }

    componentDidMount() {
        this.getJokes();
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.jokes !== prevState.jokes){
            this.sortJokes();
        }
    }

    render(){
        return (
            <div className="JokeList">
                <button className="JokeList-getmore" onClick={this.generateNewJokes}>
                  Get New Jokes
                </button>

                {this.state.sortedJokes.map(j => (
                  <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
                ))}
            </div>
        );
    }

}

export default Jokelist;