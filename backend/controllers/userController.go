package controllers

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"backend/validators"
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/google/jsonapi"
)

type UserController struct {
}

func (controller *UserController) Get(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	user := r.Context().Value("user").(models.User)

	responses.OkResponse(w, &user)
}

func (controller *UserController) Index(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	preloadRelations := []string{""}

	database := services.GetConnection()

	results := services.Filter(database, &models.User{}, map[string]interface{}{
		"first_name": r.URL.Query().Get("filter['firstName']"),
		"last_name":  r.URL.Query().Get("filter['lastName']"),
		"role":       r.URL.Query().Get("filter['role']"),
		"username":   r.URL.Query().Get("filter['username']"),
	}, preloadRelations)

	responses.OkResponse(w, results)
}

func (controller *UserController) Store(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	database := services.GetConnection()

	var body validators.StoreUserDataValidator

	err := json.NewDecoder(r.Body).Decode(&body)

	if err != nil {
		responses.UnprocessableEntityResponse(w, []error{err})

		return
	}

	validate := validator.New()

	err = validate.Struct(body.Data)

	if err != nil {
		responses.FailedValidationResponse(w, []error{err})

		return
	}

	data := map[string]string{
		"first_name": body.Data.Attributes.FirstName,
		"last_name":  body.Data.Attributes.LastName,
		"username":   body.Data.Attributes.Username,
		"password":   body.Data.Attributes.Password,
		"role":       body.Data.Attributes.Role,
	}

	user := models.User{}

	user.Fill(data)

	user.Password, err = user.HashPassword()

	if err != nil {
		responses.InternalServerErrorResponse(w, err.Error())

		return
	}

	result := database.Create(&user)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())

		return
	}

	responses.CreatedResponse(w, &user)
}

func (controller *UserController) Update(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	database := services.GetConnection()

	var body validators.UpdateUserDataValidator

	err := json.NewDecoder(r.Body).Decode(&body)

	if err != nil {
		responses.UnprocessableEntityResponse(w, []error{err})

		return
	}

	validate := validator.New()

	err = validate.Struct(body.Data)

	if err != nil {
		responses.FailedValidationResponse(w, []error{err})

		return
	}

	user := r.Context().Value("user").(models.User)

	data := map[string]string{
		"first_name": body.Data.Attributes.FirstName,
		"last_name":  body.Data.Attributes.LastName,
		"username":   body.Data.Attributes.Username,
		"password":   body.Data.Attributes.Password,
	}

	user.Fill(data)

	if body.Data.Attributes.Password != "" {
		user.Password = body.Data.Attributes.Password

		user.Password, err = user.HashPassword()

		if err != nil {
			responses.InternalServerErrorResponse(w, err.Error())

			return
		}
	}

	result := database.Save(&user)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())

		return
	}

	responses.OkResponse(w, &user)
}

func (controller *UserController) Delete(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	user := r.Context().Value("user").(models.User)

	database := services.GetConnection()

	database.Delete(&user)

	w.WriteHeader(http.StatusNoContent)
}
