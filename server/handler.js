'use strict';
const AWS = require('aws-sdk')

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_ACCESS_SECRET
})

const S3_BUCKET = 'assets.lambent.tv';
const REGION = 'eu-west-2';
const FOLDER = 'sig-img'
const URL_EXPIRATION_TIME = 60; // in seconds

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
})

module.exports.generateSignedURL = (event, context, callback) => {
  let reqObj = JSON.parse(event.body).reqObj
  let fileName = reqObj.FileName
  let fileType = reqObj.FileType

  let key = FOLDER + '/' + fileName

  myBucket.getSignedUrl('putObject', {
    Key: key,
    ContentType: event.FileType,
    Expires: URL_EXPIRATION_TIME
  }, (err, url) => {
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify({
        "fileURL": url
      })
    }
    callback(err, response)
  });
}

module.exports.listSignatureImages = (event, context, callback) => {
  myBucket.listObjects({Prefix: 'sig-img'}, (err, list) => {
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify({
        "objects": list
      })
    }
    callback(err, response)
  })
}