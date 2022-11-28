const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

module.exports.validationUpdateUser = celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        email: Joi.string().required().email(),
      }),
});

module.exports.validationCreateMovie = celebrate({
    body: Joi.object().keys({
        country: Joi.string().required(),
        director: Joi.string().required(),
        duration: Joi.number().required(),
        year: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required().custom((value, helpers) => {
            if (validator.isURL(value)) return value;
            return helpers.message('Поле image заполнено неккорректно');
          }),
        trailerLink: Joi.string().required().custom((value, helpers) => {
            if (validator.isURL(value)) return value;
            return helpers.message('Поле trailerLink заполнено неккорректно');
        }),
        thumbnail: Joi.string().required().custom((value, helpers) => {
            if (validator.isURL(value)) return value;
            return helpers.message('Поле thumbnail заполнено неккорректно');
        }),
        movieId: Joi.required(),
        nameRU: Joi.string().required(),
        nameEN: Joi.string().required(),
    })
});

module.exports.validationDeleteMovie = celebrate({
    params: Joi.object().keys({
        movieId: Joi.string().required().length(24).hex(),
     }),
});
