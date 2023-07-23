const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const fs = require("fs");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
const api_key = "0fce929200784199a7a8978918d22d9b";
metadata.set("authorization", "Key " + api_key);

module.exports = (robot) => {
  const onfile = (res, file) => {
    res.download(file, (path) => {
    });
    const imageBytes = fs.readFileSync(`/var/folders/bn/_chvn0c519sgy9g_4x4jlp100000gn/T/${file.name}`, { encoding: "base64" });
    stub.PostModelOutputs(
      {
        model_id: "identify_similar_animals",
        inputs: [{ data: { image: { base64: imageBytes } } }]
      },
      metadata,
      (err, response) => {
        for (const c of response.outputs[0].data.concepts) {
          res.send([
            `${c.name + ": " + c.value}`,
          ].join('\n'));
        }
      }
    );
  };
  robot.respond('file', (res) => {
    onfile(res, res.json);
  });
};