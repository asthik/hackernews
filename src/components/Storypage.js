import React from 'react';
import Storyitem from './Storyitem';
import loadData from '../helpers/loadData';

class Storypage extends React.Component {
    constructor(props) {
        super(props);
        console.log('story props:' + JSON.stringify(props));

        if(props.staticContext && props.staticContext.data) {
            this.state = {
                stories: props.staticContext.data.stories,
                pageno: props.staticContext.data.page,
                totalpages: props.staticContext.data.totalpages
            }
        } else {
            this.state = {
                stories: [],
                pageno: 0,
                totalpages: 0
            }
        }
    }
    

    componentDidMount() {
        setTimeout(() => {
            if(window.__ROUTE_DATA__) {
                console.log('from server: ' + window.__ROUTE_DATA__);
            } else {
                loadData('story').then(data => {
                    // console.log('data from loadData: ' + data);
                    // console.log(sessionStorage.getItem('stories'));
                    // console.log('page no at did mount', sessionStorage.getItem('pageno'));
                    sessionStorage.getItem('stories') ?
                    this.setState(prevState => {
                        // console.log('prevstate is: ' + JSON.stringify(prevState));
                        return {    
                            stories: JSON.parse(sessionStorage.getItem('stories')),
                            pageno: JSON.parse(sessionStorage.getItem('pageno')),
                            totalpages: JSON.parse(sessionStorage.getItem('totalpages'))
                        }
                    }) :
                    this.fetchData();
                });
            }
        }, 0);
    }
    
    fetchData() {
        let url = 'https://hn.algolia.com/api/v1/search?tags=story';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let {hits, page, nbPages} = data;
                sessionStorage.setItem("stories", JSON.stringify(hits));
                sessionStorage.setItem("pageno", JSON.stringify(page));
                sessionStorage.setItem("totalpages", JSON.stringify(nbPages));
                this.setState({stories: hits, pageno: page, totalpages: nbPages});
            });
    }

    fetchOthers(pageno, count) {
        if(pageno < this.state.totalpages) {
            // console.log(pageno, count);
            let url = `https://hn.algolia.com/api/v1/search?tags=story&page=${pageno+count}`;        
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    let {hits, page, nbPages} = data;
                    this.setState((prevState, currentProps)=> {
                        // console.log('prevState: ' + JSON.stringify(prevState));
                        return {
                            stories: [...hits],
                            pageno: prevState.pageno+count
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    handleHide(id) {
        // console.log(id); //w
        this.setState((prevState, currentProps) => {
        // console.log('prevState: ' + JSON.stringify(prevState)); //w
        const newStories = prevState.stories.filter(item => item.objectID !== id);
          sessionStorage.setItem('stories', JSON.stringify(newStories));
          return { stories: newStories }
        });
    }
    
    render() {
        let count = 1;
        let prevBtnClass,nextBtnClass;
        prevBtnClass= nextBtnClass = "submitBtn";
        if(this.state.pageno === 0){
            prevBtnClass = prevBtnClass + " disabled";
        }
        if(this.state.pageno === this.state.totalpages-1) {
            nextBtnClass = nextBtnClass + " disabled";
        }
        // console.log('pageno - ' + this.state.pageno);
        return (
          <div className="Storypage" data-test="storypagecomponent">
              <div className='tabledata'>
                <table>
                    <tr>
                        <th>Comments</th>
                        <th>Vote count</th>
                        <th>News details</th>
                    </tr>
                    { this.state.stories && this.state.stories.map( (story, index) => 
                    <Storyitem key={index} story={story} 
                        handleHide={() => this.handleHide(story.objectID)} />) }
                    </table>
              </div>
              <div className="btngroup">
                <input type="button" value="Previous" className={prevBtnClass}
                    onClick={() => this.fetchOthers(this.state.pageno, -count)} />
                <input type="button" value="Next" className={nextBtnClass}
                    onClick={() => this.fetchOthers(this.state.pageno, count)} />
              </div>
          </div>
        );
    }
}

export default Storypage;
