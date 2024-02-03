package validators

type StoreMenuItemDataValidator struct {
	Data struct {
		Type       string `validate:"required,eq=menu_items"`
		Attributes struct {
			Name  string  `validate:"required,min=3,max=255"`
			Type  string  `validate:"required,min=3,max=255,eq=drink|eq=starter|eq=main|eq=dessert"`
			Price float64 `validate:"gte=0"`
		} `json:"attributes"`
	} `json:"data"`
}
