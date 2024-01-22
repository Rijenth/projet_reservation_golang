package places

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"net/http"

	"github.com/google/jsonapi"

)

func IndexPlacesController(w http.ResponseWriter, r *http.Request){

	w.Header().Set("Content-Type", jsonapi.MediaType)

	database := services.GetConnection()

	var places []*models.Places

	database.Model(&models.Places{}).Find(&places)

	responses.OkResponse(w, places)

	
}