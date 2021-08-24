import { stopSubmit } from 'redux-form';
import { membersAPI, profileAPI } from '../../api/api.js';

const profileID = 'buddy/profile'
const SET_PROFILE = `${profileID}/SET_PROFILE`;
const SET_STATUS = `${profileID}/SET_STATUS`;
const SET_AVATAR = `${profileID}/SET_AVATAR`;
const SET_FOLLOWED = `${profileID}/SET_FOLLOWED`;
const TOGGLE_IS_FETCHING = `${profileID}/TOGGLE_IS_FETCHING`;

const initialState = {
   profile: [],
   status: null,
   followed: null,
   isFetching: true,
}

const profileReducer = (state = initialState, action) => {
   switch (action.type) {
      case SET_PROFILE: {
         return { ...state, profile: action.profile };
      }
      case SET_STATUS: {
         return { ...state, status: action.status };
      }
      case SET_AVATAR: {
         return { ...state, profile: { ...state.profile, photos: action.photos } };
      }
      case SET_FOLLOWED: {
         return { ...state, followed: action.followed };
      }
      case TOGGLE_IS_FETCHING: {
         return { ...state, isFetching: action.isFetching };
      }
      default: return state;
   }
}

const setProfileAC = (profile) => ({ type: SET_PROFILE, profile });
const setStatusAC = (status) => ({ type: SET_STATUS, status });
const setAvatarAC = (photos) => ({ type: SET_AVATAR, photos });
const setFollowedAC = (followed) => ({ type: SET_FOLLOWED, followed });
const toggleIsFetchingAC = (isFetching) => ({ type: TOGGLE_IS_FETCHING, isFetching });

export const setProfileThunkCreater = (id) => {
   return async (dispatch) => {
      dispatch(toggleIsFetchingAC(true));
      const response = await profileAPI.getProfileRequest(id);
      dispatch(setProfileAC(response));
      dispatch(setStatusThunkCreater(id));
      dispatch(setFollowedThunkCreater(id));
      dispatch(toggleIsFetchingAC(false));
   }
}

export const setStatusThunkCreater = (id) => {
   return async (dispatch) => {
      const response = await profileAPI.getStatusRequest(id);
      dispatch(setStatusAC(response));
   }
}

export const setFollowedThunkCreater = (id) => {
   return async (dispatch) => {
      const response = await membersAPI.getFollowingInfoRequest(id);
      dispatch(setFollowedAC(response));
   }
}

export const updateProfileThunkCreater = (data, getState) => {
   return async (dispatch) => {
      const id = getState.authorization.id;
      const response = await profileAPI.updateProfileRequest(data);
      if (response.resultCode === 0) dispatch(setProfileThunkCreater(id));
      else {
         const errorMessage = (response.messages.length > 0) && response.messages[0];
         dispatch(stopSubmit('profileForm', { _error: errorMessage }));
      }
   }
}

export const updateStatusThunkCreater = (status) => {
   return async (dispatch) => {
      const response = await profileAPI.updateStatusRequest(status);
      if (response.resultCode === 0) dispatch(setStatusThunkCreater(status));
      else {
         const errorMessage = (response.messages.length > 0) && response.messages[0];
         dispatch(stopSubmit('statusForm', { _error: errorMessage }));
      }
   }
}

export const updateAvatarThunkCreater = (avatar) => {
   return async (dispatch) => {
      const response = await profileAPI.updateAvatarRequest(avatar);
      if (response.resultCode === 0) dispatch(setAvatarAC(response.photos));
      else {
         const errorMessage = (response.messages.length > 0) && response.messages[0];
         dispatch(stopSubmit('avatarForm', { _error: errorMessage }));
      }
   }
}


export default profileReducer;