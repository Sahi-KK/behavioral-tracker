package com.behavioraltracker

import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import java.util.Calendar

class AppUsageModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "AppUsageModule"
    }

    @ReactMethod
    fun getForegroundUsage(promise: Promise) {
        val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val pm = reactApplicationContext.packageManager

        val calendar = Calendar.getInstance()
        val endTime = calendar.timeInMillis
        // Reset to midnight today for accurate daily tracking
        calendar.set(Calendar.HOUR_OF_DAY, 0)
        calendar.set(Calendar.MINUTE, 0)
        calendar.set(Calendar.SECOND, 0)
        calendar.set(Calendar.MILLISECOND, 0)
        val startTime = calendar.timeInMillis

        // queryAndAggregateUsageStats provides a map of packageName -> UsageStats
        val usageStatsMap = usageStatsManager.queryAndAggregateUsageStats(startTime, endTime)
        
        val resultList: WritableArray = Arguments.createArray()

        for (packageName in usageStatsMap.keys) {
            val stats = usageStatsMap[packageName]
            val totalTime = stats?.totalTimeInForeground ?: 0

            if (totalTime > 0 && isUserFacingApp(packageName, pm)) {
                val appMap: WritableMap = Arguments.createMap()
                appMap.putString("packageName", packageName)
                appMap.putDouble("duration", totalTime.toDouble()) // milliseconds
                resultList.pushMap(appMap)
            }
        }

        promise.resolve(resultList)
    }

    /**
     * Filters for user-facing apps by checking if they have a launcher intent.
     * This effectively excludes most system services and background processes.
     */
    private fun isUserFacingApp(packageName: String, pm: PackageManager): Boolean {
        return try {
            val intent = pm.getLaunchIntentForPackage(packageName)
            intent != null
        } catch (e: Exception) {
            false
        }
    }
}
