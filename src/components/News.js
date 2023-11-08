import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults:0,
    };

    document.title = `${this.capitalizeFirstLetter(
      this.props.category
    )}-NewsMonkey`;
  }

  async updateNews() {
    this.props.setProgress(10);
    const showAPI = async () => {
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      this.setState({ loading: true });
      let data = await fetch(url);
      this.props.setProgress(30);
      let parcedData = await data.json();
      this.props.setProgress(70);
      this.setState({
        articles: parcedData.articles,
        totalResults: parcedData.totalResults,
        loading: false,
      });
      this.props.setProgress(100);
      
    };
   
    showAPI();
    
  }
  async componentDidMount() {
    this.updateNews()
  }

  handlePrevClick = async () => {
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=73d92abd5d7a488db5bb23ff44332940&page=${
    // this.state.page - 1
    // }&pageSize=${this.props.pageSize}`;
    // this.setState({loading: true})
    // let data = await fetch(url);
    // let parcedData = await data.json();
    // this.setState({
    // page: this.state.page - 1,
    // articles: parcedData.articles,
    // loading: false,
    // });
    this.setState({
      page: this.state.page - 1,
    });
    this.updateNews();
  };

  handleNextClick = async () => {
    //this will be total number of pages,that we need to our pages
    // if (!(this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize))) {
    // // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=73d92abd5d7a488db5bb23ff44332940&page=${
    // this.state.page + 1
    // }&pageSize=${this.props.pageSize}`;
    // this.setState({loading: true})
    // let data = await fetch(url);
    // let parcedData = await data.json();
    // this.setState({
    // page: this.state.page + 1,
    // articles: parcedData.articles,
    // loading: false,
    // });
    // }
    this.setState({
      page: this.state.page + 1,
    });
    this.updateNews();
  };

  fetchMoreData = async () => {

      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page+1}&pageSize=${this.props.pageSize}
   `;

      this.setState({page: this.state.page+1});
      let data = await fetch(url);
      let parcedData = await data.json();
      this.setState({
        articles: this.state.articles.concat(parcedData.articles),
        totalResults: parcedData.totalResults,
        loading: false,
      });

  };


  render() {
    return (
      <>
        <h1 className="text-center" style={{ margin: "35px 0px",marginTop:"90px" }}>
          NewsMonkey- Top {this.capitalizeFirstLetter(this.props.category)}{" "}
          HeadLines
        </h1>
        {this.state.loading && <Spinner />}
        
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner />}
        >
          <div className="container">
          <div className="row">
            {this.state.articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title : ""}
                    description={element.description ? element.description : ""}
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                  
                </div>
              );
            })}
                </div>

          </div>
        </InfiniteScroll>
        <div className="container d-flex justify-content-between">
        </div>
      </>
    );
  }
}

export default News;
