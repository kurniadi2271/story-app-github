import Map from '../utils/map';
 

export async function storyMapper(story) {
  return {
    ...story,
    story: {
      ...story.story,
      placeName: await Map.getPlaceNameByCoordinate(story.lat, story.lng),
    },
  };
}
