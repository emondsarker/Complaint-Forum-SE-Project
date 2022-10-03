import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Badge } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';
import { MenuItem } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import Menu from '@mui/material/Menu';
import { TextField } from '@mui/material';
import Dialogs from './Dialogs';
import CompCardExpanded from './CompCardExpanded';
import { Button } from '@mui/material';
import { Alert } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import Comment from './Comment';
import MessageIcon from '@mui/icons-material/Message';

export default function CommentView( fetchedData ) {

  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [backendData, setBackEndData] = React.useState([]);
  const [empty, dempty] = React.useState([])
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [comments, setComments] = React.useState([]);

  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


   React.useEffect(()=>{

     setBackEndData({
       complaintid: fetchedData.fetchedData.complaintid,
       creationdate: fetchedData.fetchedData.creationdate,
       status: fetchedData.fetchedData.status,
       title: fetchedData.fetchedData.title,
       against: fetchedData.fetchedData.against,
       category: fetchedData.fetchedData.category,
       body: fetchedData.fetchedData.body,
       reviewer: fetchedData.fetchedData.reviewer,
       createdby: fetchedData.fetchedData.createdby,
     })
     fetchComments()
    
  }, [])

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  async function fetchComments (){
    //API Endpoint '/findAll' is for testing only
    //
    console.log(fetchedData.fetchedData.complaintid)
      await axios.get('/fetchComment', {
      headers: {
        "x-access-token": sessionStorage.getItem("jwtkey")
      },
      params: {
        complaintid: fetchedData.fetchedData.complaintid
      }
    })
    .then(function (response) {
      setComments(response.data)
      console.log(comments)
      console.log(response.data)
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
      
    });
  };

  const handleSubmit = () => {
    
    console.log(fetchedData.fetchedData.createdby);
    console.log({
      comment: value,
      complaintid: backendData.complaintid,
      createdby:backendData.createdby,
      against: backendData.against
    });
    //LABIB 
   axios.post('/createComment', {
      comment: value,
      complaintid: backendData.complaintid,
      createdby:backendData.createdby,
      against: backendData.against
    }, {
      headers: {
        "x-access-token": sessionStorage.getItem("jwtkey")
      },
    }
    )
    .then(function (response) {
      console.log(response);
      
    })
    .catch(function (error) {
      console.log(error);
      alert(error);
    });
    
      setComments(empty);
      setValue('');
      fetchComments();
  };


  return (
    <>
    { ((sessionStorage.getItem("role") == "2" || sessionStorage.getItem("role") == "3" || sessionStorage.getItem("role") == "5") && (fetchedData.fetchedData.status == "0")) ?
    <Card sx={{   p: 3,
          margin: 1,
          padding: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff'}}>

          <CardHeader
            
            title={
              <>
              <TextField
              id="outlined-multiline-flexible"
              label="Write a comment..."
              multiline
              maxRows={4}
              value={value}
              onChange={handleChange}
              sx={{width: '100%'}}
            />
            <Button onClick={handleSubmit} variant="outlined" sx={{marginTop: 2, float: 'right', }}>
                Post
              </Button></>
            }
          />
        </Card>
        : null }

    {(comments.length === 0) ?
    (<p>No comment</p>)
    :
    (
      <Box sx={{maxHeight: 300}}>
        <Typography>
          Comments <MessageIcon fontS ize="small"/>({comments.length})
        </Typography>
      {comments.map((data, index) =>(
        <>
    

      <Comment data={data}/>
    </>
      ))}

          
      </Box>
    )
    }
    </>
  );
  
}

