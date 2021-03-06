import { fetchMovies, fetchUser, fetchRatings, postUserRating, deleteApiRating } from './apiCalls';

describe('apiCalls', () => {
  describe('fetchMovies', () => {
    let mockResponse;
    beforeEach(() => { 
      mockResponse = {movies:
        [{
          average_rating: 6,
          backdrop_path: "https://image.tmdb.org/t/p/original//zTxHf9iIOCqRbxvl8W5QYKrsMLq.jpg",
          id: 1,
          overview: "In Jumanji: The Next Level",
          poster_path: "https://image.tmdb.org/t/p/original//l4iknLOenijaB85Zyb5SxH1gGz8.jpg",
          release_date: "2019-12-04",
          title: "Jumanji: The Next Level",
        },
        {
          average_rating: 5.666666666666667,
          backdrop_path: "https://image.tmdb.org/t/p/original//5BwqwxMEjeFtdknRV792Svo0K1v.jpg",
          id: 2,
          overview: "The near future",
          poster_path: "https://image.tmdb.org/t/p/original//xBHvZcjRiWyobQ9kxBhO6B2dtRI.jpg",
          release_date: "2019-09-17",
          title: "Ad Astra",
        }]
      };
    });
  
    it('should return an object with all the movies data', () => {
      window.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        });
      });

      expect(fetchMovies()).resolves.toEqual(mockResponse);
    });

    it('SAD: should throw an error if the fetch fails', () => {
      window.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: false,
        });
      });

      expect(fetchMovies()).rejects.toEqual(Error('Fetching movies failed'));
    });

    it('SAD: should throw an error if the promise does not resolve', () => {
      window.fetch = jest.fn().mockImplementation(() => {
        return Promise.reject(Error('fetch failed'))
      });

      expect(fetchMovies()).rejects.toEqual(Error('fetch failed'));
    });
  });


  describe('fetchUser', () => {
    let mockOptions, mockResponse, mockState;

    beforeEach(() => {

      mockResponse = {
        user: {id: 1, name: "Alan", email: "Here.We.Go.Again@turing.io"}
      }

      mockState = {
        email: 'Here.We.Go.Again@turing.io',
        password: '2020',
        error: false
      }

      mockOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(mockState)
      }

      window.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        });
      });
    });

    it('should fetch with the correct arguments', () => {
      const expected = ['https://rancid-tomatillos.herokuapp.com/api/v1/login', mockOptions];

      fetchUser(mockOptions);

      expect(window.fetch).toHaveBeenCalledWith(...expected);
    });

    it('should return an object with the user data', () => {
      expect(fetchUser(mockOptions)).resolves.toEqual(mockResponse);
    });

    it('SAD: should throw an error if response is not okay', () => {
      window.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: false
        })
      });

      expect(fetchUser(mockOptions)).rejects.toEqual(Error('Incorrect Username/Password'))
    });

    it('SAD: should throw an error if promise does not resolve', () => {
      window.fetch = jest.fn().mockImplementation(() => {
        return Promise.reject(Error('fetch failed'))
      });

      expect(fetchUser(mockOptions)).rejects.toEqual(Error('fetch failed'));
    });
  });

  describe('fetchRatings', () => {
    let mockId, mockResponse;
    beforeEach(() => {
      mockId = 6;

      mockResponse = {ratings: [
      { id: 22,
        user_id: 6,
        movie_id: 4,
        rating: 10,
        created_at: "2019-12-19T21:47:31.647Z",
        updated_at: "2019-12-19T21:47:31.647Z"
      },
      { id: 23,
        user_id: 6,
        movie_id: 15,
        rating: 8,
        created_at: "2019-12-19T22:05:16.098Z",
        updated_at: "2019-12-19T22:05:16.098Z"
      }
      ]};

      window.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        });
      });
    });

    it('should fetch with the correct arguments', () => {
      const expected = 'https://rancid-tomatillos.herokuapp.com/api/v1/users/6/ratings'

      fetchRatings(mockId);

      expect(window.fetch).toHaveBeenCalledWith(expected);
    });

    it('should return an object with all of the user ratings', () => {
      expect(fetchRatings(mockId)).resolves.toEqual(mockResponse);
    });

    it('SAD: should throw an error if response is not okay', () => {
      window.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: false
        })
      });

      expect(fetchRatings(mockId)).rejects.toEqual(Error('Invalid User ID'))
    });

    it('SAD: should throw an error if promise does not resolve', () => {
      window.fetch = jest.fn().mockImplementation(() => {
        return Promise.reject(Error('fetch failed'))
      });

      expect(fetchRatings(mockId)).rejects.toEqual(Error('fetch failed'));
    });
  });
  describe('postUserRating', () => {
    let mockResponse, mockOptions, mockMovieId, mockUserId, mockRating;
    beforeEach(() => {
      mockMovieId = 23;
      mockUserId = 6;
      mockRating = 9;
      mockResponse = {rating: {user_id: mockUserId, movie_id: mockMovieId, rating: mockRating}};
      mockOptions = {
        method: 'POST',
        body: JSON.stringify({
        movie_id: parseInt(mockMovieId),
        rating: parseInt(mockRating)
        }),
        headers: {
        'Content-Type': 'application/json'
        }
      };

      window.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        });
      });
    });

    it('should fetch with the correct arguments', () => {
      const expected = [`https://rancid-tomatillos.herokuapp.com/api/v1/users/${mockUserId}/ratings`, mockOptions];
      postUserRating(mockOptions, mockUserId);
      expect(window.fetch).toHaveBeenCalledWith(...expected);
    });

    it('should return a response of the newly posted rating', () => {
      expect(postUserRating(mockOptions, mockUserId)).resolves.toEqual(mockResponse);
    });

    it('SAD: should throw an error message if response is not ok', () => {
      window.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: false
        })
      });

      expect(postUserRating(mockOptions, mockUserId)).rejects.toEqual(Error('Failure to POST User Rating'));
    });
    
    it('SAD: should throw an error message if promise does not resolve', () => {
      window.fetch = jest.fn().mockImplementation(() => {
        return Promise.reject(Error('fetch failed'))
      });

      expect(postUserRating(mockOptions, mockUserId)).rejects.toEqual(Error('fetch failed'));
    });
  });

  describe('deleteApiCalls', () => {
    let mockOptions, mockMovieRating;
    beforeEach(() => {
      mockOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }

      mockMovieRating = {
        user_id: 6,
        id: 22
      }
      
      window.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: true,
        });
      });
    });

    it('should be called with the correct parameters', () => {
      deleteApiRating(mockOptions, mockMovieRating);

      expect(window.fetch).toHaveBeenCalledWith('https://rancid-tomatillos.herokuapp.com/api/v1/users/6/ratings/22', mockOptions);
    });

    it('SAD: it should throw and error when the promise is not resolved', () => {
      window.fetch = jest.fn().mockImplementation(() => {
        return Promise.reject(Error('fetch failed'))
      });
      
      expect(deleteApiRating(mockOptions, mockMovieRating)).rejects.toEqual(Error('fetch failed'))
    });

    it('SAD: it should throw an error when the response is not ok', () => {
      window.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: false,
        });
      });

      expect(deleteApiRating(mockOptions, mockMovieRating)).rejects.toEqual(Error('Failure to DELETE User Rating'))
    });
  });
});