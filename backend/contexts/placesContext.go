package contexts

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"context"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/jsonapi"
)

func PlacesContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		placesID := chi.URLParam(r, "placesId")

		var places models.Places

		database := services.GetConnection()

		database.Preload("Restaurants").Preload("User").First(&places, placesID)

		if places.ID == 0 {
			w.Header().Set("Content-Type", jsonapi.MediaType)

			responses.NotFoundResponse(w, "Places not found")

			return
		}

		ctx := context.WithValue(r.Context(), "places", places)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
