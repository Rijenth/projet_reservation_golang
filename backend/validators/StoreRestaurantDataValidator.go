package validators

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"fmt"
	"io"
	"net/http"
)

type StoreRestaurantDataValidator struct {
	Data struct {
		Type          string                    `validate:"required,eq=restaurants"`
		Attributes    StoreRestaurantAttributes `json:"attributes"`
		Relationships struct {
			User struct {
				Type string `validate:"required,eq=users"`
				ID   string `validate:"required"`
			} `validate:"required"`
		} `json:"relationships"`
	} `json:"data"`
}

type StoreRestaurantAttributes struct {
	Name string `validate:"required"`
}

func (storeRestaurantDataValidator *StoreRestaurantDataValidator) Validate(body *io.ReadCloser, w *http.ResponseWriter) error {
	var validated StoreRestaurantDataValidator

	var database = services.GetConnection()

	err := ValidateBody(&validated, body, w)

	if err != nil {
		return err
	}

	err = ValidateStruct(&validated, body, w)

	if err != nil {
		responses.FailedValidationResponse(*w, []error{err})

		return err
	}

	*storeRestaurantDataValidator = validated

	var relationshipErrors []error

	if storeRestaurantDataValidator.Data.Relationships.User.Type != "users" {
		relationshipErrors = append(relationshipErrors, fmt.Errorf("Field user.type of the relationship user is invalid"))
	}

	var userFromDatabase models.User

	result := database.First(&userFromDatabase, storeRestaurantDataValidator.Data.Relationships.User.ID)

	if result.Error != nil {
		relationshipErrors = append(relationshipErrors, fmt.Errorf("Field id of the user is invalid"))
	}

	if len(relationshipErrors) > 0 {
		responses.UnprocessableEntityResponse(*w, relationshipErrors)

		return relationshipErrors[0]
	}

	return nil
}
