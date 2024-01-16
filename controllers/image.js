const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 49816f86a2bf4332874f00f81b863284");

const handleApiCall = (req, res) => {
    stub.PostModelOutputs(
        {
            user_app_id: {
                user_id: "logansherman",
                app_id: "face-recognition"
            },
            // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
            model_id: "face-detection",
            inputs: [{data: {image: {url: req.body.input}}}]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
                return;
            }
    
            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return;
            }
    
            res.json(response);
        }
    );
}

const handleImage = (req, res, knex) => {
    const { id } = req.body;
    knex('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('Error getting entries'));
}

module.exports = {
    handleImage,
    handleApiCall
};