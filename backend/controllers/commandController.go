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
	"github.com/google/uuid"
)

type CommandController struct {
}

func (controller *CommandController) Get(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	command := r.Context().Value("command").(models.Command)

	responses.OkResponse(w, &command)
}

func (controller *CommandController) Index(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	restaurant := r.Context().Value("restaurant").(models.Restaurant)

	database := services.GetConnection()

	var commands []*models.Command

	database.Where("restaurant_id = ?", restaurant.ID).Preload("Restaurant").Find(&commands)

	responses.OkResponse(w, commands)
}

func (controller *CommandController) Store(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	restaurant := r.Context().Value("restaurant").(models.Restaurant)

	database := services.GetConnection()

	var body validators.StoreCommandDataValidator

	err := json.NewDecoder(r.Body).Decode(&body)

	if err != nil {
		responses.UnprocessableEntityResponse(w, err.Error())

		return
	}

	validate := validator.New()

	err = validate.Struct(body.Data)

	if err != nil {
		responses.FailedValidationResponse(w, err)

		return
	}

	// TODO: generate identification number for the command
	identificationNumber, err := uuid.NewRandom()

	if err != nil {
		responses.InternalServerErrorResponse(w, err.Error())
		return
	}

	// TODO: calculate the total price of the command
	// calculateTotalPrice()

	command := models.Command{
		IdentificationNumber: identificationNumber.String(),
		Description:          body.Data.Attributes.Description,
		Status:               "not_started",
		Amount:               0,
		Restaurant:           &restaurant,
	}

	result := database.Create(&command)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())

		return
	}

	responses.CreatedResponse(w, &command)
}

func (controller *CommandController) Update(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	database := services.GetConnection()

	var body validators.UpdateCommandDataValidator

	err := json.NewDecoder(r.Body).Decode(&body)

	if err != nil {
		responses.UnprocessableEntityResponse(w, err.Error())

		return
	}

	validate := validator.New()

	err = validate.Struct(body.Data)

	if err != nil {
		responses.FailedValidationResponse(w, err)

		return
	}

	command := r.Context().Value("command").(models.Command)

	// TODO: calculate the total price of the command if amount is changed then update the amount

	//TODO: update the date of the command if the date is changed

	if body.Data.Attributes.Description != "" {
		command.Description = body.Data.Attributes.Description
	}

	if body.Data.Attributes.Status != "" {
		command.Status = body.Data.Attributes.Status
	}

	// TODO: see if we change an other field

	result := database.Save(&command)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())

		return
	}

	responses.OkResponse(w, &command)
}

func (controller *CommandController) Delete(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	command := r.Context().Value("command").(models.Command)

	database := services.GetConnection()

	database.Delete(&command)

	w.WriteHeader(http.StatusNoContent)
}
