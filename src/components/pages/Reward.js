import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CardHeader } from "@mui/material";

function Reward() {
  return (
    <div>
      <Typography
        variant="h4"
        align="center"
        component="div"
        sx={{ mx: 4, my: 4 }}
      >
        Rewards
      </Typography>
      <Box sx={{ mx: 3 }}>
        <Grid container rowSpacing={5} columnSpacing={{ xs: 3, sm: 4, md: 5 }}>
          {Array.from(Array(6)).map((_, index) => (
            <Grid item xs={2} sm={4} md={4} key={index}>
              <Card sx={{ boxShadow: 5 }}>
                <CardHeader
                  title={`Reward ${index}`}
                  sx={{ textAlign: "center" }}
                />
                <CardMedia
                  component="img"
                  sx={{ width: "75%", mx: "auto", mb:2 }}
                  image="https://s3.amazonaws.com/askbob/users/photos/2118/big/Photo_portrait_Aymeric_NOEL2.jpg?1624545267"
                  alt="green iguana"
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}

export default Reward;
