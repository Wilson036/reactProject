import React, { Component } from "react";
import "./App.css";
import { Container, Box, Heading, Card, Image ,Text, SearchField, Icon, Spinner} from "gestalt";
import Strapi from "strapi-sdk-javascript/build/main";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const apiUrl = process.env.API_URL||'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class App extends Component {
  state ={
    brands:[],
    searchItem:'',
    loadingBrands: true
  }

  async componentWillMount(){
    
    try {
      const {data} = await strapi.request('POST','/graphql',{
        data:{
          query:`query{
            brands{
              _id
              name
              description
              Image{
                name
                url
              }
            }
          }`
        }
      });
      //console.log(response);
      this.setState({brands: data.brands,loadingBrands: false})
    } catch (error) {
      this.setState({loadingBrands: false});
      console.log(error);
    }
  } 
  
  handleChange = ({value}) => {
    this.setState({searchItem: value});
  }

  filteredBrands = ({ searchItem, brands}) => {
    return brands.filter( brand =>{
      return brand.name.toLowerCase().includes(searchItem.toLowerCase());
    });
  };

render() {
    const { searchItem, loadingBrands } = this.state;
    return (
      <Container>
        <Box 
          display="flex"
          justifyContent="center"
          marginTop={4}>
          
          <SearchField  
            id="serchField"
            accessibilityLabel="Brand Search Field"
            onChange={this.handleChange}
            placeholder="Search Brands" />
            <Box margin={3}>
              <Icon 
                icon="filter"
                color ={ searchItem ? "orange": "gray"} 
                size={20}
                accessibilityLabel="Filter"  />
            </Box>
        </Box>
        
        <Box 
          display="flex"
          justifyContent="center"
          marginBottom ={2}  
        >
          <Heading color="midnight" size="md">
            Brew Brands
          </Heading> 
        </Box>
        <Box
          dangerouslySetInlineStyle={{
            __style:{
              backgroundColor:'#d6c8ec'
            }
          }} 
          shape="rounded"
          wrap 
          display="flex" 
          justifyContent="around">
            {
              this.filteredBrands(this.state).map(brand => (
                <Box
                  margin={2}
                  width={200}
                  key={brand._id} 
                >
                  <Card
                    image={
                      <Box height={200} width={200}>
                        <Image
                          fit="cover"
                          naturalHeight={1}
                          naturalWeight={1} 
                          src={`${apiUrl}${brand.Image[0].url}`} />
                      </Box>
                    }>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      direction="column"
                      >
                      <Text bold size="xl" >{brand.name}</Text>
                      <Text>{brand.description}</Text>
                      <Text bold size="xl">
                        <Link to={`/${brand._id}`}>See Brews</Link>
                      </Text>
                    </Box>
                  </Card>
                </Box>
              ))
            }
          </Box>
          <Spinner show ={loadingBrands} accessibilityLabel="Loading Spinner"/>
          <Loader show = {loadingBrands}/>
      </Container>
    )
  }
}

export default App;
