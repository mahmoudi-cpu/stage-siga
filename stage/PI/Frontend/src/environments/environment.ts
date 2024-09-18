/*
export const environment = {
    production: false,
    api_Url:'http://localhost:8084/PI/',
  
  };

  */

  export const environment = {
    production: false,
    api_Url:'http://localhost:8084/PI/',
    moduleId: module.id,
    preserveWhitespaces: false,
    SIGN_IN_KEY: '9a4f2c8d3b7a1e6f45c8a0b3f267d8b1d4e6f3c8a9d2b5f8e3a9c8b5f6v8a3d9',
    multipartConfig: {
      autoUpload: true,
      fileSizeLimit: 20971520000,
      allowedFileType: ['image', 'pdf', 'docx', 'xlsx', 'xls', 'txt', 'zip', 'doc', 'csv']
    },
    errorOptions: {
      message: true,
      wrap: false
    },
    emailConfig: {
      host: 'smtp.gmail.com',
      port: 587,
      username: 'achouchene03@gmail.com',
      password: 'eqfb lpmq egpm ekch',
      tls: true,
      ssl: false,
      allowInvalidCertificates: true
    }
  };