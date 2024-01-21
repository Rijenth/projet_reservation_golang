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

func CreateUser(w http.ResponseWriter, r *http.Request) {
	// On définit le header de la réponse
	w.Header().Set("Content-Type", jsonapi.MediaType)

	// On récupère la connexion à la base de donnée
	database := services.GetConnection()

	var data validators.StoreUserValidator

	// On décode le corps de la requête et on le stocke dans une variable data
	err := json.NewDecoder(r.Body).Decode(&data)

	// Si une erreur survient lors du décodage du corps de la requête
	// on retourne une erreur 422 en utilisant la fonction UnprocessableEntityResponse
	// depuis le package responses (import "backend/responses")
	if err != nil {
		responses.UnprocessableEntityResponse(w, err.Error())

		return
	}

	// On valide les données envoyées par l'utilisateur
	// en utilisant la structure StoreUserValidator
	validate := validator.New()

	err = validate.Struct(data)

	// Si une erreur survient lors de la validation des données
	// on retourne une erreur 422 et on affiche les erreurs
	if err != nil {
		responses.FailedValidationResponse(w, err)

		return
	}

	// On transfère le contenu de la variable data dans un objet User
	user := models.User{
		FirstName: data.FirstName,
		LastName:  data.LastName,
		Username:  data.Username,
		Password:  data.Password,
	}

	result := database.Create(&user)

	// Si une erreur survient lors de l'insertion en base de donnée
	// on retourne une erreur 500
	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())

		return
	}

	// retourne le status 200 et le contenu de la variable user
	responses.CreatedResponse(w, &user)
}

func GetUser(w http.ResponseWriter, r *http.Request) {
	return
}

func GetUsers(w http.ResponseWriter, r *http.Request) {
	return
}

func UpdateUser(w http.ResponseWriter, r *http.Request) {
	return
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	return
}
