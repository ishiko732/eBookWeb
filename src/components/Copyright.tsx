import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
export default function Copyright(props: any) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="http://localhost:3000/">
          ishiko
        </Link>{' '}
        {'2022-'}{new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }