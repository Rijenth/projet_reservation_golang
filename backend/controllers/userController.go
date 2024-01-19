package controllers

import (
	"backend/models"
	"backend/services"
	"encoding/json"
	"net/http"

	"gorm.io/gorm"
)

func toJsonApi(data interface{}) []byte {
	jsonData, err := json.Marshal(data)

	if err != nil {
		return []byte(`{"error": "An error occured while encoding the response body"} ", "message": "` + err.Error() + `"}`)
	}

	return jsonData
}

func CreateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var user models.User
	var database *gorm.DB = services.GetConnection()

	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		w.WriteHeader(http.StatusUnprocessableEntity)

		w.Write([]byte(`{"error": "An error occured while decoding the request body"} ", "message": "` + err.Error() + `"}`))

		return
	}

	result := database.Create(&user)

	if result.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)

		w.Write([]byte(`{"error": "Error creating user", "message": "` + result.Error.Error() + `"}`))

		return
	}

	w.WriteHeader(http.StatusOK)

	//json.NewEncoder(w).Encode(user)

	//w.Write([]byte(`{"data": "` + string(toJsonApi(user)) + `"}`))
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
