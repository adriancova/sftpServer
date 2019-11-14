const express = require('express');
const router = express.Router();
const Client = require('ssh2-sftp-client');
const sftp = new Client();
const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/files');
  },
  filename: (req, file, cb) => {
    console.log('archivo', file);
    let filetype = '';
    let name = 'image-';
    if (file.mimetype === 'image/gif') {
      filetype = 'gif';
    }
    if (file.mimetype === 'image/png') {
      filetype = 'png';
    }
    if (file.mimetype === 'image/jpeg') {
      filetype = 'jpg';
    }
    if (file.mimetype === 'audio/mp3') {
      filetype = 'mp3';
      name = 'mp3-';
    }
    if (file.mimetype === 'text/txt') {
      filetype = 'txt';
      name = 'txt-';
    }
    cb(null, name + Date.now() + '.' + filetype); //añadir un random al nombre de archivo
  }
});

const upload = multer({ storage: storage });
const privateKeyString = `-----BEGIN RSA PRIVATE KEY-----
MIICXgIBAAKBgQDYx4pDXi20Bh4q6KBZefZeFIJxoonJTN5Z0PmPHO8VLGYJw9Ae
lp+C7JN3swcqkzRWfLpd8DsGbKH3Vif2XvhgtWN5WAc9qlPQW283uZqTahRH1HdS
FufjFTq63loxyEOUjcpaqyJGr6UjWuErWxkHUHLiLz+jLdaKJxqEB+OlJwIDAQAB
AoGAQdV/oOv2F0kQWlmhcOsALhwubVI+ZBrrH/29/H9+AEEmj+qexttZgApW0rBV
CdIAwA9LDgJJ+q59Fb9djY3UAgNwldmV11MYDcmsb9OZs8xtY4uQsWt5mghlqBtk
chQaSY+1/j2kXg/OPj2o1TDoIiVn6aTx57OLfjV6M1tYApECQQD3oDQBE2ys4NdB
2y3l1GpFAgOw2SDDdqGZURi8hW08ZxzIIqBpf4FyHBS0PBDDr4VnGaBEEDGj5BD5
Gb+4uaYJAkEA4BxJpXfmvbyjLsXInU7UzfO35rLZkFHddAt7CvEcQr8op9VC0izq
kJV4BVY70X6WlljRzJQiga/gBxbKE9M9rwJBAIqpALXhhKdBuAe+jfL2gRNnT13G
F9ycH11U1f8qz8JVEv7WtPCeX4PgSY+rWs/ZB2B2LxIt5z4YxZBXZM4x1tECQQCF
yB0mi8bQKNV4zFSPo0lhkEWNj+JURqpd5aSTyY7HQXmxhpsW//0eRjuZY/rdeiXG
pkrHRv66UBT55l7HKui9AkEAo2fG+vsxgGW2P7wVwN1DakbXcXmkciC77OW6cEzq
R3BsIOUA+hQKPXMBaqnzbwObn9gSoe9qx6nryq3OCT7I/w==
-----END RSA PRIVATE KEY-----`;
const privateKeyString2 = 
`MIICXgIBAAKBgQDYx4pDXi20Bh4q6KBZefZeFIJxoonJTN5Z0PmPHO8VLGYJw9Ae
lp+C7JN3swcqkzRWfLpd8DsGbKH3Vif2XvhgtWN5WAc9qlPQW283uZqTahRH1HdS
FufjFTq63loxyEOUjcpaqyJGr6UjWuErWxkHUHLiLz+jLdaKJxqEB+OlJwIDAQAB
AoGAQdV/oOv2F0kQWlmhcOsALhwubVI+ZBrrH/29/H9+AEEmj+qexttZgApW0rBV
CdIAwA9LDgJJ+q59Fb9djY3UAgNwldmV11MYDcmsb9OZs8xtY4uQsWt5mghlqBtk
chQaSY+1/j2kXg/OPj2o1TDoIiVn6aTx57OLfjV6M1tYApECQQD3oDQBE2ys4NdB
2y3l1GpFAgOw2SDDdqGZURi8hW08ZxzIIqBpf4FyHBS0PBDDr4VnGaBEEDGj5BD5
Gb+4uaYJAkEA4BxJpXfmvbyjLsXInU7UzfO35rLZkFHddAt7CvEcQr8op9VC0izq
kJV4BVY70X6WlljRzJQiga/gBxbKE9M9rwJBAIqpALXhhKdBuAe+jfL2gRNnT13G
F9ycH11U1f8qz8JVEv7WtPCeX4PgSY+rWs/ZB2B2LxIt5z4YxZBXZM4x1tECQQCF
yB0mi8bQKNV4zFSPo0lhkEWNj+JURqpd5aSTyY7HQXmxhpsW//0eRjuZY/rdeiXG
pkrHRv66UBT55l7HKui9AkEAo2fG+vsxgGW2P7wVwN1DakbXcXmkciC77OW6cEzq
R3BsIOUA+hQKPXMBaqnzbwObn9gSoe9qx6nryq3OCT7I/w==`;
const sftpOpts = {
  host: '192.240.110.98', // string Hostname or IP of server.
  port: 22, // Port number of the server.
  //forceIPv4: false, // boolean (optional) Only connect via IPv4 address
  //forceIPv6: false, // boolean (optional) Only connect via IPv6 address
  username: '089000003605', // string Username for authentication.
  //password: 'borsch', // string Password for password-based user authentication
  privateKey: privateKeyString2, //fs.readFileSync('/home/ubuntu/.ssh/id_rsa'), // Buffer or string that contains
  //passphrase: 'a pass phrase', // string - For an encrypted private key
  readyTimeout: 20000, // integer How long (in ms) to wait for the SSH handshake
  //strictVendor: true // boolean - Performs a strict server vendor check
  //debug: myDebug // function - Set this to a function that receives a single
  // string argument to get detailed (local) debug information.
  retries: 2, // integer. Number of times to retry connecting
  retry_factor: 2, // integer. Time factor used to calculate time between retries
  retry_minTimeout: 2000 // integer. Minimum timeout between attempts
};
const connectSftpSantander = () => {
  //console.log(fs.readFileSync)
  sftp
    .connect(sftpOpts)
    .then(() => {
      return sftp.list('/pathname');
    })
    .then(data => {
      console.log(data, 'the data info');
      return data;
    })
    .catch(err => {
      console.log(err, 'catch error');
      return err;
    });
};

/* Load file to upload. */
router.get('/loadFile', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sftp', async (req, res, next) => {
  const test = await connectSftpSantander();
  console.log(test);
  res.json({ prueba: 'text' });
});

router.post('/uploadFile', upload.single('file'), async function(
  req,
  res,
  next
) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  });
  if (!req.file) {
    res.status(500);
    res.json({
      success: false,
      message: 'Upload Failed',
      binaryResult: 0
    });
  }

  res.json({
    success: true,
    message: 'Upload Success',
    fileUrl: req.file.filename
  });
});

module.exports = router;
