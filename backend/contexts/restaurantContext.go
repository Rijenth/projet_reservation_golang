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

func RestaurantContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		restaurantID := chi.URLParam(r, "restaurantId")

		var restaurant models.Restaurant

		database := services.GetConnection()

		database.Preload("Place").Preload("Menus").First(&restaurant, restaurantID)

		if restaurant.ID == 0 {
			w.Header().Set("Content-Type", jsonapi.MediaType)

			responses.NotFoundResponse(w, "Restaurant not found")

			return
		}

		ctx := context.WithValue(r.Context(), "restaurant", restaurant)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
