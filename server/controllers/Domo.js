const models = require('../models');

const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.favoriteColor) {
    return res.status(400).json({ error: 'RAWR! Name, Age, and favorite color are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    favoriteColor: req.body.favoriteColor,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.statuse(400).json({ error: 'An error occured' });
  });

  return domoPromise;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ domos: docs });
  });
};

const deleteDomo = (request, response) => {
  console.log("in delete controller");
  const req = request;
  const res = response;
  if (!req.body._id) {
    return res.status(400).json({ error: 'An error occurred' });
  }
  return Domo.DomoModel.deleteDomo(req.body._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(202).json({ error: 'An error occured' });
    }
    return false;
  });
};

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
module.exports.getDomos = getDomos;
module.exports.deleteDomo = deleteDomo;
