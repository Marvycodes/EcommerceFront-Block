const router = require("express").Router();


let Products = require("../models/product.models");




router.route("/addproduct").post(async (req, res) => {
  const form = new multiparty.Form({ uploadDir: IMAGE_UPLOAD_DIR });
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
  console.log(`fields = ${JSON.stringify(fields, null, 2)}`);
  console.log(`files = ${JSON.stringify(files, null, 2)}`);
  const imagePath = files.file[0].path;
  const client = new S3Client({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  const links = [];
  for (const file of files.file) {
    const ext = file.originalFilename.split(".").pop();

    const newFilename = Date.now() + "." + ext;

    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: newFilename,
        Body: fs.readFileSync(file.path),
        ACL: "public-read",
        ContentType: mime.lookup(file.content),
      })
    );

    const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
    links.push(link);

    const imageFileName = imagePath.slice(imagePath.lastIndexOf("\\") + 1);
    const imageURL = IMAGES_BASE_URL + imageFileName;
    console.log(imageURL);

    console.log(files.file.length);
  }
  return res.json({ links });
});

router.route("/").get((req, res) => {
  Products.find().sort({createdAt: -1})
    .then((products) => res.json(products))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const price = Number(req.body.price);
  const images = req.body.images;
  const category = req.body.category;
  const productProperties = req.body.category;

  const newProducts = new Products({
    title,
    description,
    price,
    images,
    category,
  });

  newProducts
    .save()
    .then(() => res.json("Products added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Products.findById(req.params.id)
    .then((product) => res.json(product))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/id").get((req, res) => {
  const ids = req.body.ids;
  Products.find({_id:ids})
    .then((product) => res.json(product))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Products.findByIdAndDelete(req.params.id)
    .then(() => res.json("Product deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});



module.exports = router;
