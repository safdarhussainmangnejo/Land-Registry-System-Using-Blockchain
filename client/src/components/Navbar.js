import * as React from 'react';
import {AppBar} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import {NavLink} from "react-router-dom";

const pages = ['Home', 'Buyer', 'Seller', 'Inspecter', 'About'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex'} }}
          >
            Land Registry System
          </Typography>
          <Box sx={{ flexGrow: 1, marginLeft: '30%', display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}

                style={{ color: 'white', display: 'block', marginLeft: '1%' }}
              >
                <NavLink style={{ textDecoration:"none", color:"white"} } to={`/${page}`}>{page}</NavLink>
              </Button>
            ))}

          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
