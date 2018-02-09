const slackTranform = (userId, slackObj) => {
  if (slackObj.filetype === 'png' || slackObj.filetype === 'jpg' ) {
    return {
      filename: slackObj.name,
      date: slackObj.created,
      userId : userId,
      path : slackObj.url_private,
      download_url: slackObj.url_private_download,
      description : slackObj.initial_comment ? slackObj.initial_comment.toString() :'uploaded from slack',
      labels : {'From slack': true},
      public: false,
    };
  }
  return false;
};




module.exports = slackTranform;
