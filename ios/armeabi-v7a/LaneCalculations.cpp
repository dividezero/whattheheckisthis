
#include "LaneCalculations.h"
#include <opencv2/core/core.hpp>
#include <opencv2/imgproc/imgproc.hpp>

#include <android/log.h>

// Global static pointer used to ensure a single instance of the class.
LaneCalculations* LaneCalculations::m_pInstance = NULL;

/** This function is called to create an instance of the class.
    Calling the constructor publicly is not allowed. The constructor
    is private and is only called by this Instance function.
*/

LaneCalculations* LaneCalculations::Instance()
{
   if (!m_pInstance)   // Only allow one instance of class to be generated.
      m_pInstance = new LaneCalculations;

   return m_pInstance;
}


double LaneCalculations::calculateMeanLateralPosition()
{
  return LaneCalculations::Instance()->sumLateralPosition/LaneCalculations::Instance()->countLateralPosition;

}

double LaneCalculations::calculateSDLP()
{
  double mean = calculateMeanLateralPosition();

  double sumOfVariance = 0;
  for(int i=0; i< LaneCalculations::Instance()->countLateralPosition; i++)
  {
	  double temp1 = (LaneCalculations::Instance()->arrayLateralPosition[i] - mean) * (LaneCalculations::Instance()->arrayLateralPosition[i] - mean);
	  sumOfVariance += temp1;


  }

  double variance = sumOfVariance/LaneCalculations::Instance()->countLateralPosition;
  double sdlp = sqrt(variance); //dividing to calculate sdlp with respect to single lane
  sdlp = floor(sdlp*100 + 0.5)/100; //rounding off to 2 d.p


  return sdlp;
}

