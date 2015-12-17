'use strict';

angular.module('bsis').factory('PostDonationCounsellingService', function (Api) {

    return {

        updatePostDonationCounselling: function (postDonationCounselling, onSuccess, onError) {
            Api.PostDonationCounselling.update({}, postDonationCounselling, onSuccess, onError);
        },

        getPostDonationCounsellingFormFields: function (onSuccess, onError) {
            Api.PostDonationCounsellingFormFields.get(onSuccess, onError);
        }
    };
});
